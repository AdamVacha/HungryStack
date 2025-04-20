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

<div class="card w-full p-3">
	<!-- Header -->
	<header class="mb-3 flex items-center justify-between">
		<h2
			class="h3 bg-gradient-to-br from-green-500 to-blue-500 box-decoration-clone bg-clip-text pb-1 font-semibold text-transparent"
		>
			Your Certificates
		</h2>
		<div class="variant-filled-primary badge">
			{$earnedCertificates.length} of 4 earned
		</div>
	</header>

	<!-- Certificate display area -->
	<div class="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
		{#each displayCertificates as certificate (certificate.id)}
			<div
				class="certificate-card flex flex-col overflow-hidden rounded-lg border border-surface-300 bg-surface-100 transition-all hover:bg-surface-200 hover:shadow-md"
			>
				<!-- Certificate thumbnail -->
				<div class="certificate-thumbnail flex items-center justify-center p-1">
					<div class="aspect-[4/3] w-full overflow-hidden rounded-md bg-white shadow-md">
						{#if certificate.templateImage?.startsWith('data:image/svg+xml')}
							<!-- SVG data URI -->
							<img
								src={certificate.templateImage}
								alt={certificate.title}
								class="h-full w-full object-contain p-1"
							/>
						{:else}
							<!-- Fallback SVG certificate -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 400 300"
								class="h-full w-full p-2"
							>
								<rect width="100%" height="100%" fill="#f8f8ff" />
								<rect
									x="10"
									y="10"
									width="380"
									height="280"
									stroke="#3E6E93"
									stroke-width="4"
									fill="none"
									rx="5"
									ry="5"
								/>
								<rect
									x="20"
									y="20"
									width="360"
									height="260"
									stroke="#336791"
									stroke-width="2"
									fill="none"
									rx="3"
									ry="3"
								/>
								<text
									x="200"
									y="80"
									font-family="Arial"
									font-size="24"
									text-anchor="middle"
									fill="#336791">{certificate.title}</text
								>
								<text
									x="200"
									y="110"
									font-family="Arial"
									font-size="12"
									text-anchor="middle"
									fill="#333">Certificate</text
								>
							</svg>
						{/if}
					</div>
				</div>

				<!-- Certificate info - more compact -->
				<div class="flex-1 p-2">
					<h4 class="line-clamp-1 text-sm font-semibold">{certificate.title}</h4>
					<p class="mb-1 text-xs text-gray-600">{formatDate(certificate.earnedAt)}</p>
					<button
						class="variant-filled-primary btn btn-sm w-full py-1 text-xs"
						onclick={() => viewCertificate(certificate.id)}
					>
						View
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
							class="bg-surface-200-700 aspect-[4/3] w-full overflow-hidden rounded-md shadow-md"
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
					<div class="flex-1 p-2">
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

	.aspect-\[4\/3\] {
		aspect-ratio: 4/3;
	}
</style>
