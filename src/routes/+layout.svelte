<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import Footer from '../lib/components/Footer.svelte';
	import { page } from '$app/state';
	import { signOut } from '@auth/sveltekit/client';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { popup } from '@skeletonlabs/skeleton';
	import { storePopup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	import { initBadgeStore } from '$lib/badges/badges';
	import { initCertificateStore } from '$lib/certificates/certificateStore';
	import { onMount } from 'svelte';

	onMount(() => {
		if (page.data.session?.user) {
			initBadgeStore();
			initCertificateStore();
		}
	});

	let { children } = $props();

	const userMenuPopup: PopupSettings = {
		event: 'click',
		target: 'userMenuPopup',
		placement: 'bottom',
		closeQuery: '#will-close'
	};
</script>

<ParaglideJS {i18n}>
	<!-- App Shell -->
	<AppShell title="Hungry Stack">
		<svelte:fragment slot="header">
			<!-- App Bar -->
			<AppBar class="px-2 py-3 sm:px-4 md:px-8 md:py-4">
				<svelte:fragment slot="lead">
					<!-- if logged in go to dashboard, else go to home -->
					<a
						href={page.data.session ? '/dashboard' : '/'}
						class="ml-2 text-lg font-bold text-tertiary-600 transition-colors duration-200 hover:text-primary-500 sm:ml-4 sm:text-xl md:ml-8 md:text-2xl dark:text-primary-500 dark:hover:text-tertiary-400"
						><span class="logo-icon">🥞</span>
						<span class="hidden sm:inline">Hungry Stack</span><span class="sm:hidden"
							>Hungry Stack</span
						></a
					>
				</svelte:fragment>

				<svelte:fragment slot="trail">
					<!-- User Icon -->
					{#if page.data.session}
						<button
							class="px-2 transition-colors duration-200 hover:text-primary-500 sm:px-4"
							use:popup={userMenuPopup}
							aria-label="User menu"
						>
							<svg
								fill="currentColor"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 45.532 45.532"
								class="h-5 w-5 sm:h-6 sm:w-6"
							>
								<g>
									<path
										d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765 S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53 c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012 c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592 c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
									></path>
								</g>
							</svg>
						</button>

						<div class="card w-40 py-2 shadow-xl sm:w-48" data-popup="userMenuPopup">
							<div class="grid grid-cols-1 gap-2">
								<a
									href="/dashboard"
									id="will-close"
									class="block px-3 py-2 text-sm hover:bg-secondary-400 sm:px-4 sm:text-base"
									>Dashboard</a
								>
								<a
									href="/learn-more"
									id="will-close"
									class="block px-3 py-2 text-sm hover:bg-secondary-400 sm:px-4 sm:text-base"
									>About</a
								>
								<a
									href="/badges"
									id="will-close"
									class="block px-3 py-2 text-sm hover:bg-secondary-400 sm:px-4 sm:text-base"
									>Badges</a
								>
								<button
									id="will-close"
									onclick={() => signOut({ callbackUrl: '/' })}
									class="block w-full px-3 py-2 text-left text-sm hover:bg-secondary-400 sm:px-4 sm:text-base"
								>
									Sign Out
								</button>
							</div>
						</div>
					{/if}

					<!-- LightSwitch -->
					<LightSwitch />
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>

		<!-- Page Route Content -->
		<div class="h-full w-full">
			{@render children()}
		</div>

		<!-- Footer -->
	</AppShell>
</ParaglideJS>

<style>
	/* Ensure app content takes full width on mobile */
	:global(.app-shell) {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
	}

	:global(.app-shell-header) {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	:global(.app-shell-content) {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	/* Enhance touch targets on mobile */
	@media (max-width: 640px) {
		:global(.app-bar a),
		:global(.app-bar button) {
			padding: 0.5rem;
			min-height: 44px;
			display: flex;
			align-items: center;
		}
	}
</style>
