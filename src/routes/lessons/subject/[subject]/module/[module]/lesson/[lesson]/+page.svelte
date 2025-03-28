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

	let iframeSrc = $derived(`data:text/html;charset=utf-8,${encodeURIComponent(code)}`);
	let isCodePanelHorizontal = $state(true);

	// Progress tracking
	let isCompleted = $state(data?.progress?.completedAt !== null);
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
					const moduleBadges = awardModuleCompletionBadges(module.id.toString());
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
		if (lesson?.nextLessonId && subject?.id && module?.id) {
			window.location.href = `/lessons/subject/${subject.id}/module/${module.id}/lesson/${lesson.nextLessonId}`;
		}
	}

	async function goToPreviousLesson() {
		if (lesson?.prevLessonId && subject?.id && module?.id) {
			window.location.href = `/lessons/subject/${subject.id}/module/${module.id}/lesson/${lesson.prevLessonId}`;
		}
	}
</script>

<BadgeNotification />

<div class="flex-1 rounded-lg bg-white p-4 shadow dark:bg-gray-900">
	<h1 class="text-3xl font-bold">{lesson?.title || 'Loading...'}</h1>
	<p>Modify the code below and see the result in real time!</p>

	<!-- Code Editor and Preview Container -->
	<div
		class="mt-4 flex gap-4"
		class:flex-row={isCodePanelHorizontal}
		class:flex-col={!isCodePanelHorizontal}
	>
		<!-- Toggle Layout Button -->
		<button
			onclick={() => (isCodePanelHorizontal = !isCodePanelHorizontal)}
			class="mb-4 flex items-center gap-2 rounded bg-tertiary-500 px-4 py-2 text-white hover:bg-tertiary-600"
		>
			{#if isCodePanelHorizontal}
				<span>Switch to Vertical Layout</span>
			{:else}
				<span>Switch to Horizontal Layout</span>
			{/if}
		</button>

		<!-- Code Editor -->
		<div class="flex-1">
			<h2 class="text-lg font-semibold">Code Editor</h2>
			<textarea
				class="h-60 w-full rounded-lg border bg-gray-50 p-3 font-mono dark:bg-gray-700"
				bind:value={code}
			></textarea>
		</div>

		<!-- Live Preview -->
		<div class="flex-1">
			<h2 class="text-lg font-semibold">Live Preview</h2>
			<iframe src={iframeSrc} class="h-60 w-full rounded-lg border bg-white" title="Live Preview"
			></iframe>
		</div>
	</div>

	<!-- Navigation Buttons -->
	<div class="mt-4 flex justify-between">
		{#if lesson?.prevLessonId}
			<button
				class="rounded-lg bg-gray-400 px-4 py-2 hover:bg-gray-500 dark:bg-gray-600"
				onclick={goToPreviousLesson}
			>
				← Previous
			</button>
		{:else}
			<div></div>
			<!-- Empty div to maintain flex spacing -->
		{/if}

		{#if !isCompleted}
			<button
				class="rounded-lg bg-green-500 px-4 py-2 hover:bg-green-600"
				onclick={markLessonComplete}
			>
				Mark as Completed
			</button>
		{/if}

		{#if lesson?.nextLessonId}
			<button
				class="rounded-lg bg-tertiary-500 px-4 py-2 hover:bg-tertiary-600"
				onclick={goToNextLesson}
			>
				Next →
			</button>
		{:else}
			<div></div>
			<!-- Empty div to maintain flex spacing -->
		{/if}
	</div>
</div>
