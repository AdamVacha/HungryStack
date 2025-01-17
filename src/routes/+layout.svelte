<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import Footer from '../components/Footer.svelte';

	let { children } = $props();
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
