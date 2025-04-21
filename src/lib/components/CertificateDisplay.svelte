<script lang="ts">
	import { earnedCertificates } from '$lib/certificates/certificateStore';
	import { goto } from '$app/navigation';

	let { limit = 4 } = $props();

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	let displayCertificates = $derived($earnedCertificates.slice(0, limit));

	function viewCertificate(certificateId: number) {
		goto(`/certificates/${certificateId}`);
	}
</script>

<div class="card w-full p-4 pb-1">
	<!-- Header -->
	<header class="mb-4 flex items-center justify-between">
		<h2
			class="h2 bg-gradient-to-br from-green-500 to-blue-500 box-decoration-clone bg-clip-text pb-1 font-semibold text-transparent"
		>
			Your Certificates
		</h2>
		<div class="variant-filled-primary badge">
			{$earnedCertificates.length} of 4 earned
		</div>
	</header>

	<!-- Certificate display area -->

	<div class="mb-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each displayCertificates as certificate (certificate.id)}
			<div
				class="certificate-card bg-surface-50 dark:bg-surface-700 flex flex-col overflow-hidden rounded-lg border-surface-300 shadow-lg transition-all"
			>
				<!-- Certificate thumbnail -->
				<div class="certificate-thumbnail bg-surface-200-700 flex items-center justify-center p-3">
					<div class="w-full  overflow-hidden p-1">
						<img
							src={certificate.iconImage}
							alt={certificate.title}
							class="h-auto rounded-md object-cover"
						/>
					</div>
				</div>

				<!-- Certificate info -->
				<div class="flex-1 p-3 pt-0 text-center">
					<h4 class="mb-1 line-clamp-1 text-sm font-bold">{certificate.title}</h4>
					<p class="mb-2 text-xs">{formatDate(certificate.earnedAt)}</p>
					<button
						class="variant-filled-primary btn btn-sm w-full py-1.5 text-xs font-medium"
						onclick={() => viewCertificate(certificate.id)}
					>
						View Certificate
					</button>
				</div>
			</div>
		{/each}

		<!-- Placeholder cards for not-yet-earned certificates -->
		{#if displayCertificates.length < limit && $earnedCertificates.length < 4}
			{#each Array(Math.min(limit, 4) - displayCertificates.length) as _, i}
				<div
					class="certificate-card bg-surface-100-800 flex flex-col rounded-lg border border-surface-300 opacity-50"
				>
					<!-- Certificate thumbnail -->
					<div class="certificate-thumbnail flex items-center justify-center p-1">
						<div
							class="bg-surface-200-700 aspect-square w-full overflow-hidden rounded-md shadow-md"
						>
							<div class="flex h-full w-full items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="opacity-30"
								>
									<rect width="18" height="14" x="3" y="5" rx="2" />
									<path d="M21 8h-8" />
									<path d="M21 12h-8" />
									<path d="M21 16h-8" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Certificate info -->
					<div class="flex-1 p-2 text-center">
						<h4 class="line-clamp-1 text-sm font-semibold">Future Certificate</h4>
						<p class="mb-1 line-clamp-1 text-xs text-gray-500">Complete all modules</p>
						<button class="variant-filled-surface btn btn-sm w-full py-1 text-xs" disabled>
							Locked
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.certificate-thumbnail img,
	.certificate-thumbnail svg {
		transition: transform 0.3s ease;
	}

	.certificate-card:hover .certificate-thumbnail img,
	.certificate-card:hover .certificate-thumbnail svg {
		transform: scale(1.05);
	}

	.btn-sm {
		min-height: 30px;
	}

	.aspect-square {
		aspect-ratio: 1 / 1;
	}
</style>
