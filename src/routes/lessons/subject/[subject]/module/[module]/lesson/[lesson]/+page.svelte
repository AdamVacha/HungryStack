<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { showMultipleBadgeNotifications } from '$lib/badges/badgeNotification';
	import BadgeNotification from '$lib/components/BadgeNotification.svelte';
	import { awardModuleCompletionBadges } from '$lib/badges/badgeStore';

	// Get page data from loader
	let { data } = $props<{ data: PageData }>();

	// Using derived for data properties
	let lesson = $derived(data?.lesson);
	let module = $derived(data?.module);
	let subject = $derived(data?.subject);

	// Local state for editor - initialize with a default value first
	let code = $state('');

	// Set initial code value after lesson data is available
	$effect(() => {
		if (lesson?.content) {
			code = lesson.content;
		}
	});

	let processedCode = $derived(code.replace(/\\n/g, '\n'));
	let iframeSrc = $derived(`data:text/html;charset=utf-8,${encodeURIComponent(processedCode)}`);
	let isCodePanelHorizontal = $state(true);

	// Progress tracking
	let isCompleted = $state(data?.progress ? data.progress.completedAt !== null : false);
	let timeSpent = $state(0);
	let timeTracker: number | undefined;

	// Start tracking time spent on the lesson
	onMount(() => {
		timeTracker = window.setInterval(() => {
			timeSpent += 1;
		}, 1000);

		return () => {
			if (timeTracker) clearInterval(timeTracker);
		};
	});

	// Mark lesson as completed
	async function markLessonComplete() {
		if (isCompleted || !lesson?.id) return;

		try {
			const response = await fetch(`/api/progress/lesson/${lesson.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					timeSpent
				})
			});

			if (response.ok) {
				isCompleted = true;

				// Get badges earned
				const result = await response.json();
				if (result.badges && result.badges.length > 0) {
					showMultipleBadgeNotifications(result.badges);
				}

				// Check if module was completed
				if (result.moduleCompleted && module?.id) {
					const moduleBadges = await awardModuleCompletionBadges(module.id.toString());
					if (moduleBadges.length > 0) {
						showMultipleBadgeNotifications(moduleBadges);
					}
				}
			}
		} catch (error) {
			console.error('Failed to mark lesson as complete:', error);
		}
	}

	// Navigation functions
	async function goToNextLesson() {
		await markLessonComplete();

		if (lesson?.nextLessonId && subject?.id) {
			// Use the pre-loaded module ID for the next lesson
			const moduleId = data.nextLessonModule || module.id;
			window.location.href = `/lessons/subject/${subject.id}/module/${moduleId}/lesson/${lesson.nextLessonId}`;
		}
	}

	async function goToPreviousLesson() {
		if (lesson?.prevLessonId && subject?.id && module?.id) {
			window.location.href = `/lessons/subject/${subject.id}/module/${module.id}/lesson/${lesson.prevLessonId}`;
		}
	}
</script>

<BadgeNotification />

<div class="w-full flex-1 rounded-lg bg-surface-300 p-6 shadow-lg dark:bg-gray-900">
	<header class="mb-6">
		<div class="mb-1 flex items-center">
			<h1 class="text-3xl font-bold">{lesson?.title || 'Loading...'}</h1>
		</div>
		<p>Modify the code below and see the result in real time!</p>
	</header>

	<!-- Code Editor and Preview Container -->
	<div
		class="grid gap-6"
		class:grid-cols-2={isCodePanelHorizontal}
		class:grid-cols-1={!isCodePanelHorizontal}
	>
		<!-- Code Editor -->
		<div class="overflow-hidden rounded-lg bg-surface-100 dark:bg-gray-800">
			<header class="flex items-center justify-between px-4 py-2 dark:bg-gray-700">
				<h2 class="text-lg font-medium">Code Editor</h2>
				<button
					onclick={() => (isCodePanelHorizontal = !isCodePanelHorizontal)}
					class="rounded p-1 transition-colors hover:bg-gray-600"
					title={isCodePanelHorizontal
						? 'Switch to Vertical Layout'
						: 'Switch to Horizontal Layout'}
				>
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
						{#if isCodePanelHorizontal}
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
							<line x1="12" y1="3" x2="12" y2="21" />
						{:else}
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
							<line x1="3" y1="12" x2="21" y2="12" />
						{/if}
					</svg>
				</button>
			</header>
			<textarea
				class="h-80 w-full resize-none p-4 font-mono text-sm focus:outline-none dark:bg-gray-800"
				bind:value={code}
			></textarea>
		</div>

		<!-- Live Preview -->
		<div class="overflow-hidden rounded-lg">
			<header class="bg-surface-100 px-4 py-2 dark:bg-gray-700">
				<h2 class="text-lg font-medium">Live Preview</h2>
			</header>
			<div class="h-80 bg-white">
				<iframe src={iframeSrc} class="h-full w-full border-0" title="Live Preview"></iframe>
			</div>
		</div>
	</div>

	<!-- Navigation Buttons -->
	<footer class="mt-6 flex justify-between">
		<button
			class="flex items-center gap-2 rounded-lg bg-gray-700 px-6 py-3 text-white transition-colors hover:bg-gray-600"
			onclick={goToPreviousLesson}
			disabled={!lesson?.prevLessonId}
			class:opacity-50={!lesson?.prevLessonId}
			class:cursor-not-allowed={!lesson?.prevLessonId}
		>
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
			Previous
		</button>

		<div>
			{#if !isCompleted}
				<button
					class="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-500"
					onclick={markLessonComplete}
				>
					Mark as Completed
				</button>
			{/if}
		</div>

		<button
			class="flex items-center gap-2 rounded-lg bg-tertiary-500 px-6 py-3 text-white transition-colors hover:bg-tertiary-400"
			onclick={goToNextLesson}
			disabled={!lesson?.nextLessonId}
			class:opacity-50={!lesson?.nextLessonId}
			class:cursor-not-allowed={!lesson?.nextLessonId}
		>
			Next
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
		</button>
	</footer>
</div>
