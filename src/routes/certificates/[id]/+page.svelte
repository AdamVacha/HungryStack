<!-- <script lang="ts">
	//import { earnedCertificates } from '$lib/certificates/certificateStore';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Get certificate ID from params
	let certificateId = $derived(parseInt($page.params.id));
	//let certificate = $derived($earnedCertificates.find((c) => c.id === certificateId));
	let username = $derived($page.data.session?.user?.name ?? 'Student');
	let showSaveButton = $state(true);

	// Format date for display
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Save certificate as image
	function saveCertificate() {
		if (!certificate) return;

		// In a real implementation, you would use html2canvas or similar library
		// For this simple implementation, we'll just show a success message
		setTimeout(() => {
			showSaveButton = false;
			alert('Certificate downloaded!');
		}, 1000);
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
				<span class="text-success-500">✓ Downloaded</span>
			{/if}
		</div>

		<div class="certificate-container" id="certificate-container">
			<div
				class="mx-auto max-w-4xl rounded-lg border-8 border-double border-primary-300 bg-white p-8 shadow-xl"
			>
				<div class="text-center">
					<h1 class="mb-2 text-3xl font-bold text-primary-700">Hungry Stack Certificate</h1>
					<h2 class="mb-6 text-xl text-secondary-600">Certificate of Completion</h2>

					<div class="mb-8 flex justify-center">
						<img src="/images/mascot.png" alt="Hungry Stack Mascot" class="h-24 w-24" />
					</div>

					<p class="mb-4 text-lg">This certifies that</p>
					<h3 class="mb-4 text-2xl font-bold text-primary-600">{username}</h3>
					<p class="mb-6 text-lg">has successfully completed all modules in</p>
					<h3 class="mb-6 text-2xl font-bold text-secondary-600">{certificate.subjectName}</h3>

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
</style> -->
