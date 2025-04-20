import { db } from '$lib/server/db';
import {
	certificates,
	studentCertificates,
	subjects,
	modules,
	studentProgress,
	lessons
} from '$lib/server/db/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';

const DEFAULT_TEMPLATES = {
	HTML: '/images/certificates/html-certificate.png',
	CSS: '/images/certificates/css-certificate.png',
	Javascript: '/images/certificates/javascript-certificate.png',
	Backend: '/images/certificates/backend-certificate.png'
};

// Seed initial certificates for each subject
export async function seedCertificates() {
	// Check if certificates already exist
	const existingCount = await db.select({ count: sql<number>`count(*)` }).from(certificates);

	if (existingCount[0]?.count > 0) {
		return;
	}

	// Get all subjects
	const allSubjects = await db.query.subjects.findMany();

	// Create certificates for each subject
	const certificatesData = allSubjects.map((subject) => ({
		title: `${subject.name} Master`,
		description: `Certified completion of all ${subject.name} modules`,
		subjectId: subject.id,
		templateImage:
			DEFAULT_TEMPLATES[subject.name as keyof typeof DEFAULT_TEMPLATES] ||
			'/images/certificates/default-certificate.png',
		requiredModules: null
	}));

	try {
		await db.insert(certificates).values(certificatesData);
		console.log('Certificates seeded successfully');

		// Update each certificate with required modules
		for (const subject of allSubjects) {
			// Get all modules for this subject
			const subjectModules = await db.query.modules.findMany({
				where: eq(modules.subjectId, subject.id)
			});

			// Get certificate for this subject
			const certificate = await db.query.certificates.findFirst({
				where: eq(certificates.subjectId, subject.id)
			});

			if (certificate && subjectModules.length > 0) {
				// Update certificate with required modules
				await db
					.update(certificates)
					.set({
						requiredModules: JSON.stringify(subjectModules.map((m) => m.id))
					})
					.where(eq(certificates.id, certificate.id));
			}
		}
	} catch (error) {
		console.error('Failed to seed certificates:', error);
	}
}

// Check if a subject is completed by a user
export async function isSubjectCompleted(userId: string, subjectId: number): Promise<boolean> {
	if (!userId) return false;

	try {
		// Get all modules for this subject
		const subjectModules = await db.query.modules.findMany({
			where: eq(modules.subjectId, subjectId)
		});

		if (subjectModules.length === 0) return false;

		// Check if each module is completed
		for (const module of subjectModules) {
			const moduleCompleted = await isModuleCompleted(userId, module.id);
			if (!moduleCompleted) {
				return false;
			}
		}

		// If we get here, all modules are completed
		return true;
	} catch (error) {
		console.error(`Error checking if subject ${subjectId} is completed:`, error);
		return false;
	}
}

// Check if a module is completed
export async function isModuleCompleted(userId: string, moduleId: number): Promise<boolean> {
	if (!userId) return false;

	try {
		// Get all lessons for this module
		const moduleLessons = await db.query.lessons.findMany({
			where: eq(lessons.moduleId, +moduleId),
			orderBy: lessons.orderInModule
		});

		if (moduleLessons.length === 0) return false;

		const lessonIds = moduleLessons.map((l) => l.id);

		// Get completed lessons for this user
		const completedLessons = await db
			.select()
			.from(studentProgress)
			.where(
				and(
					eq(studentProgress.studentId, userId),
					inArray(studentProgress.lessonId, lessonIds),
					sql`${studentProgress.completedAt} IS NOT NULL`
				)
			);

		// Module is completed if all lessons are completed
		return completedLessons.length === moduleLessons.length;
	} catch (error) {
		console.error(`Error checking if module ${moduleId} is completed:`, error);
		return false;
	}
}

// Award certificate to user
export async function awardCertificate(userId: string, subjectId: number): Promise<any | null> {
	if (!userId) {
		console.error('User ID is required');
		return null;
	}

	try {
		// First check if subject is actually completed
		const isCompleted = await isSubjectCompleted(userId, subjectId);
		if (!isCompleted) {
			console.log(`Subject ${subjectId} is not completed by user ${userId}`);
			return null;
		}

		// Find the certificate for this subject
		const certificate = await db.query.certificates.findFirst({
			where: eq(certificates.subjectId, subjectId)
		});

		if (!certificate) {
			console.error(`Certificate for subject ${subjectId} not found`);
			return null;
		}

		// Check if user already has this certificate
		const existingCertificate = await db.query.studentCertificates.findFirst({
			where: and(
				eq(studentCertificates.studentId, userId),
				eq(studentCertificates.certificateId, certificate.id)
			)
		});

		if (existingCertificate) {
			console.log(`User ${userId} already has certificate for subject ${subjectId}`);
			return existingCertificate;
		}

		// Get subject details for completion data
		const subject = await db.query.subjects.findFirst({
			where: eq(subjects.id, subjectId)
		});

		// Award certificate to user
		const completionData = {
			subjectName: subject?.name || 'Unknown',
			completionDate: new Date().toISOString(),
			studentId: userId
		};

		// Insert new student certificate
		const [newCertificate] = await db
			.insert(studentCertificates)
			.values({
				studentId: userId,
				certificateId: certificate.id,
				earnedAt: new Date(),
				completionData: JSON.stringify(completionData)
			})
			.returning();

		console.log(`Certificate for subject ${subjectId} awarded to user ${userId}`);
		return {
			...newCertificate,
			certificate
		};
	} catch (error) {
		console.error(`Error awarding certificate for subject ${subjectId} to user ${userId}:`, error);
		return null;
	}
}

// Get all user certificates
export async function getUserCertificates(userId: string): Promise<any[]> {
	if (!userId) return [];

	try {
		const userCertificates = await db
			.select({
				id: studentCertificates.id,
				certificateId: certificates.id,
				title: certificates.title,
				description: certificates.description,
				subjectId: certificates.subjectId,
				subjectName: subjects.name,
				templateImage: certificates.templateImage,
				earnedAt: studentCertificates.earnedAt,
				completionData: studentCertificates.completionData
			})
			.from(studentCertificates)
			.innerJoin(certificates, eq(studentCertificates.certificateId, certificates.id))
			.innerJoin(subjects, eq(certificates.subjectId, subjects.id))
			.where(eq(studentCertificates.studentId, userId));

		return userCertificates.map((cert) => ({
			...cert,
			completionData:
				typeof cert.completionData === 'string'
					? JSON.parse(cert.completionData)
					: cert.completionData
		}));
	} catch (error) {
		console.error('Error fetching user certificates:', error);
		return [];
	}
}

// Check for and award subject completion certificates
export async function checkAndAwardSubjectCertificates(
	userId: string,
	moduleId: number
): Promise<any | null> {
	if (!userId) return null;

	try {
		// Get the module to find its subject
		const module = await db.query.modules.findFirst({
			where: eq(modules.id, moduleId)
		});

		if (!module || !module.subjectId) {
			return null;
		}

		// Check if subject is completed
		const isCompleted = await isSubjectCompleted(userId, module.subjectId);
		if (!isCompleted) {
			return null;
		}

		// Award certificate
		return await awardCertificate(userId, module.subjectId);
	} catch (error) {
		console.error('Error checking and awarding subject certificates:', error);
		return null;
	}
}
