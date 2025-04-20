import { writable, get, type Writable } from 'svelte/store';

// Certificate type definition
export interface Certificate {
	id: number;
	certificateId: number;
	title: string;
	description: string;
	subjectId: number;
	subjectName: string;
	templateImage: string;
	earnedAt: string;
	completionData: {
		subjectName: string;
		completionDate: string;
		studentId: string;
	};
}

// Store for certificates
export const earnedCertificates: Writable<Certificate[]> = writable([]);
export const isLoadingCertificates: Writable<boolean> = writable(false);

// Initialize the certificate store with data from the server
export async function initCertificateStore(): Promise<void> {
	// Prevent duplicate loading
	if (get(isLoadingCertificates)) {
		return;
	}

	isLoadingCertificates.set(true);

	try {
		const response = await fetch('/api/certificates');

		if (!response.ok) {
			throw new Error(`Failed to load certificates: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		earnedCertificates.set(data.certificates || []);
	} catch (error) {
		console.error('Error loading certificates:', error);
	} finally {
		isLoadingCertificates.set(false);
	}
}

// Refresh the certificate data
export async function refreshCertificateData(): Promise<void> {
	await initCertificateStore();
}

// Check if user has a certificate for a specific subject
export function hasSubjectCertificate(subjectId: number): boolean {
	const currentCertificates = get(earnedCertificates);
	return currentCertificates.some((cert) => cert.subjectId === subjectId);
}

// Get certificate count
export function getCertificateCount(): number {
	return get(earnedCertificates).length;
}