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
			<AppBar class="px-8 py-4">
				<svelte:fragment slot="lead">
					<a
						href="/"
						class="ml-8 text-2xl font-bold text-tertiary-600 transition-colors duration-200 hover:text-primary-500 dark:text-primary-500 dark:hover:text-tertiary-400"
						><span class="logo-icon">🥞</span> Hungry Stack</a
					>
				</svelte:fragment>

				<svelte:fragment slot="trail">
					<!-- User Icon -->
					{#if page.data.session}
						<button
							class="px-4 transition-colors duration-200 hover:text-primary-500"
							use:popup={userMenuPopup}
							aria-label="User menu"
						>
							<svg
								fill="currentColor"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 45.532 45.532"
								class="h-6 w-6"
							>
								<g>
									<path
										d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765 S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53 c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012 c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592 c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
									></path>
								</g>
							</svg>
						</button>

						<div class="card w-48 py-2 shadow-xl" data-popup="userMenuPopup">
							<div class="grid grid-cols-1 gap-2">
								<a href="/dashboard" id="will-close" class="block px-4 py-2 hover:bg-secondary-400"
									>Dashboard</a
								>
								<a href="/badges" id="will-close" class="block px-4 py-2 hover:bg-secondary-400"
									>Badges</a
								>
								<a href="/settings" id="will-close" class="block px-4 py-2 hover:bg-secondary-400"
									>Settings</a
								>
								<button
									id="will-close"
									onclick={() => signOut({ callbackUrl: '/' })}
									class="block w-full px-4 py-2 text-left hover:bg-secondary-400"
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
		{@render children()}

		<!-- Footer -->
		<Footer />
	</AppShell>
</ParaglideJS>
