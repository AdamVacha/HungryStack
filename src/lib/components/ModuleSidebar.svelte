<script lang="ts">
	import {
		type subjects,
		type modules,
		type lessons,
		type studentProgress
	} from '$lib/server/db/schema';
	// Props
	let {
		subject,
		module,
		lesson: lessonList,
		currentLessonId,
		progress = {}
	} = $props<{
		subject: subjects;
		module: modules;
		lessons: lessons[];
		currentLessonId: number;
		progress?: Record<number, studentProgress>;
	}>();

	// State
	let isExpanded = $state(true);

	// Determine if the module is locked
	let isModuleLocked = $derived(module?.isLocked ?? false);

	// Sort lessons by their order in the module
	let sortedLessons = $derived(
		lessonList
			? [...lessonList].sort((a, b) => (a?.orderInModule || 0) - (b?.orderInModule || 0))
			: []
	);
</script>

<div class="w-64 rounded-lg bg-surface-100 dark:bg-surface-800">
	<div class="p-4">
		<!-- Module header -->
		<button
			class="flex w-full cursor-pointer items-center justify-between rounded-t-lg p-2 text-left {isModuleLocked
				? 'bg-gray-400 dark:bg-gray-600'
				: module?.id?.toString() === currentLessonId?.toString()
					? 'bg-green-500 dark:bg-green-700'
					: 'bg-tertiary-500 dark:bg-tertiary-700'}"
			onclick={() => (isExpanded = !isExpanded)}
			disabled={isModuleLocked}
			aria-expanded={isExpanded}
		>
			<span class="font-semibold">{module?.name || 'Module'}</span>
			<div class="flex items-center">
				{#if isModuleLocked}
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
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
						<path d="M7 11V7a5 5 0 0 1 10 0v4" />
					</svg>
				{:else}
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
						<path d={isExpanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
					</svg>
				{/if}
			</div>
		</button>

		<!-- Lessons within module -->
		{#if isExpanded && !isModuleLocked}
			<ul class="mt-1 space-y-1 p-2">
				{#each sortedLessons as lesson}
					{@const isCompleted = progress[lesson?.id]?.completedAt !== null}
					{@const isCurrent = lesson?.id?.toString() === currentLessonId?.toString()}

					<li
						class="cursor-pointer rounded p-2 {isCurrent
							? 'bg-tertiary-300 dark:bg-tertiary-900'
							: isCompleted
								? 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'
								: 'hover:bg-tertiary-100 dark:hover:bg-tertiary-800'}"
					>
						<a
							href={`/lessons/subject/${subject?.id || ''}/module/${module?.id || ''}/lesson/${lesson?.id || ''}`}
							class="flex w-full items-center justify-between text-left"
						>
							<span>{lesson?.title || 'Lesson'}</span>
							{#if isCompleted}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M20 6L9 17l-5-5" />
								</svg>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
