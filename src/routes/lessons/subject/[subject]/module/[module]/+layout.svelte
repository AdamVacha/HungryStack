<script lang="ts">
	import type { LayoutProps } from './$types';
	import ModuleSidebar from '$lib/components/ModuleSidebar.svelte';
	import { onMount } from 'svelte';

	let { children, data }: LayoutProps = $props();
	let module = $derived(data?.module);
	let subject = $derived(data?.subject);
	let lessonList = $derived(data?.lessons || []);
	let progress = $derived(data?.currentProgress);
	let currentLessonId = $derived(data?.currentLessonId ? +data.currentLessonId : 0);
	let modules = $derived(data?.allModules || []);

	// Track if module panel is open
	let isModulesPanelOpen = $state(false);

	// On mobile, the sidebar is fixed position and overlays the content
	let isMobile = $state(false);
	let windowWidth = $state(0);

	// Use a derived value instead of an event listener
	$effect(() => {
		if (windowWidth > 0) {
			// Only run this when windowWidth has been set (client-side)
			isMobile = windowWidth < 768;

			// Auto close on very small screens
			if (isMobile && isModulesPanelOpen && windowWidth < 480) {
				isModulesPanelOpen = false;
			}

			// Auto open on desktop
			if (!isMobile && !isModulesPanelOpen) {
				isModulesPanelOpen = true;
			}
		}
	});

	onMount(() => {
		windowWidth = window.innerWidth;
		isModulesPanelOpen = window.innerWidth >= 768;

		const handleResize = () => {
			windowWidth = window.innerWidth;
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	// Toggle module panel
	function toggleModulesPanel() {
		isModulesPanelOpen = !isModulesPanelOpen;
	}
</script>

<div
	class="relative flex h-full w-full flex-col gap-2 overflow-hidden p-1 sm:gap-4 sm:p-2 md:flex-row md:p-4"
>
	<!-- Overlay for mobile when sidebar is open -->
	{#if isMobile && isModulesPanelOpen}
		<div class="fixed inset-0 z-20 bg-black bg-opacity-50" onclick={toggleModulesPanel}></div>
	{/if}

	<!-- Modules Sidebar - Fixed on mobile, normal on desktop -->
	<div
		class="sidebar-container z-30 transition-all duration-300"
		class:fixed={isMobile}
		class:inset-y-0={isMobile}
		class:left-0={isMobile}
		class:w-64={isModulesPanelOpen}
		class:w-0={!isModulesPanelOpen}
		class:md:relative={true}
	>
		<div
			class="h-full overflow-hidden rounded-r-lg bg-surface-100 shadow-lg transition-all duration-300 dark:bg-surface-800"
			class:w-64={isModulesPanelOpen}
			class:w-0={!isModulesPanelOpen}
		>
			{#if isModulesPanelOpen}
				<ModuleSidebar
					{subject}
					{modules}
					currentModuleId={module?.id || 0}
					{currentLessonId}
					lessons={lessonList}
					{progress}
				/>
			{/if}
		</div>

		<!-- Toggle Button -->
		<button
			onclick={toggleModulesPanel}
			class="absolute z-40 rounded-full bg-tertiary-500 p-2 shadow-lg transition-colors hover:bg-tertiary-600"
			class:right-2={isModulesPanelOpen && isMobile}
			class:-right-4={!isModulesPanelOpen || !isMobile}
			class:top-4={true}
		>
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
				{#if isModulesPanelOpen}
					<path d="M15 18l-6-6 6-6" />
				{:else}
					<path d="M9 18l6-6-6-6" />
				{/if}
			</svg>
		</button>
	</div>

	<!-- Main Content Area - Full width on mobile -->
	<div class="flex-1 overflow-hidden rounded-lg">
		{@render children?.()}
	</div>
</div>

<style>
	/* Prevent body scrolling when mobile sidebar is open */
	:global(body.sidebar-open) {
		overflow: hidden;
	}

	/* Ensure the parent container fills available height */
	:global(html, body, .app-shell, .app-shell-content) {
		height: 100%;
		overflow-x: hidden;
	}
</style>
