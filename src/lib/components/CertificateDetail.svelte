<script lang="ts">
	import { earnedCertificates } from '$lib/certificates/certificateStore';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import html2canvas from 'html2canvas';

	// Get certificate ID from params
	let certificateId = $derived(parseInt($page.params.id));
	let certificate = $derived($earnedCertificates.find((c) => c.id === certificateId));
	let username = $derived($page.data.session?.user?.name ?? 'Student');
	let showSaveButton = $state(true);

	const subjectBorders = {
		HTML: 'border-red-300',
		CSS: 'border-blue-300',
		JavaScript: 'border-gray-300',
		Backend: 'border-green-300',
		default: 'border-primary-300'
	};

	let borderColor = $derived(
		certificate && certificate.subjectName
			? subjectBorders[certificate.subjectName as keyof typeof subjectBorders] ||
					subjectBorders.default
			: subjectBorders.default
	);

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Save certificate as image
	async function saveCertificate() {
		if (!certificate) return;

		try {
			showSaveButton = false;

			// Get the certificate container element
			const certificateElement = document.getElementById('certificate-container');
			if (!certificateElement) {
				throw new Error('Certificate element not found');
			}

			// Create a canvas from the certificate element
			const canvas = await html2canvas(certificateElement.firstElementChild as HTMLElement);
			// Convert the canvas to a data URL
			const dataUrl = canvas.toDataURL('image/png');

			// Create a download link
			const downloadLink = document.createElement('a');
			downloadLink.href = dataUrl;
			downloadLink.download = `${certificate.title}_certificate.png`;

			// Trigger the download
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);

			// Provide feedback to the user
			setTimeout(() => {
				showSaveButton = true;
			}, 3000); // Show the button again after 3 seconds
		} catch (error) {
			console.error('Error saving certificate:', error);
			alert('Failed to download certificate. Please try again.');
			showSaveButton = true;
		}
	}

	// Navigate back to dashboard
	function goBack() {
		goto('/dashboard');
	}

	onMount(() => {
		// If certificate doesn't exist, redirect to dashboard
		if (!certificate) {
			goBack();
		}
	});
</script>

{#if certificate}
	<div class="container mx-auto px-4 py-8">
		<div class="mb-6 flex items-center justify-between">
			<button class="variant-ghost-surface btn" onclick={goBack}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
				Back to Dashboard
			</button>

			{#if showSaveButton}
				<button class="variant-filled-primary btn" onclick={saveCertificate}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mr-2"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
					Save as Image
				</button>
			{:else}
				<span class="flex items-center text-success-500">
					<svg
						class="mr-2 h-5 w-5 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Generating certificate...
				</span>
			{/if}
		</div>

		<div class="certificate-container" id="certificate-container">
			<div
				class="mx-auto max-w-4xl rounded-lg border-8 border-double bg-primary-50 {borderColor} p-8 shadow-xl"
			>
				<!-- Certificate Header with Subject-Based Color Scheme -->
				<div class="text-center text-black">
					<h1 class="mb-2 text-3xl font-bold text-gray-700">Certificate of Completion</h1>
					<h2 class="mb-6 text-xl text-gray-600">Hungry Stack</h2>

					<div class="mb-4 flex justify-center">
						<img src={certificate.templateImage} alt={certificate.title} class="h-40 w-auto" />
					</div>

					<p class="mb-4 text-lg">This certifies that</p>
					<h3 class="mb-4 text-2xl font-bold text-primary-600">{username}</h3>
					<p class="mb-6 text-lg">has successfully completed all modules in</p>
					<h3 class="mb-6 text-2xl font-bold text-gray-700">{certificate.subjectName}</h3>

					<p class="mb-8 text-center">
						Demonstrating proficiency in all required skills and knowledge of the {certificate.subjectName}
						curriculum.
					</p>

					<div class="mb-4 flex items-center justify-between">
						<div class="text-left">
							<p class="font-semibold">Certificate ID</p>
							<p class="text-sm">{certificate.id}</p>
						</div>
						<div class="text-right">
							<p class="font-semibold">Date Issued</p>
							<p class="text-sm">{formatDate(certificate.earnedAt)}</p>
						</div>
					</div>

					<div class="border-t border-gray-300 pt-6">
						<p class="text-sm text-gray-600">
							This certificate was issued by Hungry Stack, a comprehensive platform for learning
							full-stack web development.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8 text-center">
		<p>Loading certificate...</p>
	</div>
{/if}

<style>
	.certificate-container {
		transform-origin: center;
		transition: transform 0.3s ease;
	}

	@media print {
		.btn {
			display: none;
		}

		.certificate-container {
			border: none;
			box-shadow: none;
		}
	}
</style>
