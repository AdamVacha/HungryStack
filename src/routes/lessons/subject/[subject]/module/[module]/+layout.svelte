<script lang="ts">
	import type { LayoutProps } from './$types';
	import ModuleSidebar from '$lib/components/ModuleSidebar.svelte';

	let { children, data }: LayoutProps = $props();
	let module = $derived(data?.module);
	let subject = $derived(data?.subject);
	let lessonList = $derived(data?.lessons || []);
	let progress = $derived(data?.currentProgress);
	let currentLessonId = $derived(data?.currentLessonId ? +data.currentLessonId : 0);
	let modules = $derived(data?.allModules || []);

	// Track if module panel is open
	let isModulesPanelOpen = $state(true);

	// Toggle module panel
	function toggleModulesPanel() {
		isModulesPanelOpen = !isModulesPanelOpen;
	}
</script>

<div class="flex h-full flex-row gap-4 p-4">
	<!-- Collapsible Modules Panel -->
	<div
		class="sidebar-container transition-all duration-300"
		class:w-64={isModulesPanelOpen}
		class:w-0={!isModulesPanelOpen}
	>
		<div class="relative h-full" class:w-64={isModulesPanelOpen} class:w-0={!isModulesPanelOpen}>
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

			<!-- Toggle Button -->
			<button
				onclick={toggleModulesPanel}
				class="absolute -right-4 top-4 z-10 rounded-full bg-tertiary-500 p-2 shadow-lg transition-colors hover:bg-tertiary-600"
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
	</div>

	<!-- Main Content Area -->
	<div class="flex-1 rounded-lg border border-solid">
		{@render children?.()}
	</div>
</div>
