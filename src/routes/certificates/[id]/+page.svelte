<script lang="ts">
	import { earnedCertificates, initCertificateStore } from '$lib/certificates/certificateStore';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import CertificateDetail from '$lib/components/CertificateDetail.svelte';

	// Get certificate ID from params
	let certificateId = $derived(parseInt($page.params.id));
	let certificate = $derived($earnedCertificates.find((c) => c.id === certificateId));

	onMount(async () => {
		// Ensure certificates are loaded
		await initCertificateStore();

		// Certificate will be updated automatically when the store updates
	});
</script>

{#if certificate}
	<CertificateDetail />
{:else}
	<div class="container mx-auto px-4 py-8 text-center">
		<div class="flex flex-col items-center justify-center">
			<div class="mb-4 rounded-lg bg-surface-200 p-8 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mx-auto mb-4 text-surface-500"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
				<h2 class="mb-2 text-xl font-bold">Certificate Not Found</h2>
				<p>The certificate you're looking for doesn't exist or hasn't been earned yet.</p>
				<a href="/dashboard" class="variant-filled-primary btn mt-4">Return to Dashboard</a>
			</div>
		</div>
	</div>
{/if}
