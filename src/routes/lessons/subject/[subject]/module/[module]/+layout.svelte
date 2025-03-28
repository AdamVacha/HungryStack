<script lang="ts">
	import type { LayoutProps } from './$types';
	import ModuleSidebar from '$lib/components/ModuleSidebar.svelte';

	let { children, data }: LayoutProps = $props();
	let module = $derived(data?.module);
	let subject = $derived(data?.subject);
	let lessonList = $derived(data?.lessons || []);
	let progress = $derived(data?.currentProgress);
	let currentLessonId = $derived(data?.currentLessonId ? +data.currentLessonId : 0);

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
		class="relative transition-all duration-300"
		class:w-64={isModulesPanelOpen}
		class:w-0={!isModulesPanelOpen}
	>
		<!-- Module panel content -->
		<div
			class="absolute h-full overflow-auto bg-surface-100 dark:bg-surface-800"
			class:w-64={isModulesPanelOpen}
			class:w-0={!isModulesPanelOpen}
		>
			{#if module && subject}
				<ModuleSidebar {subject} {module} lessons={lessonList} {currentLessonId} {progress} />
			{:else}
				<div class="p-4 text-center">Loading module...</div>
			{/if}
		</div>

		<!-- Toggle Module Panel Button -->
		<button
			onclick={toggleModulesPanel}
			class="absolute -right-0 top-4 z-10 rounded-r bg-tertiary-500 p-1 text-white hover:bg-tertiary-600"
		>
			{#if isModulesPanelOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- Main Content Area -->
	<div class="flex-1 rounded-lg border border-solid p-4">
		{@render children?.()}
	</div>
</div>
