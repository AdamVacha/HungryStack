<script lang="ts">
	import type {
		subjects,
		modules as modulesType,
		lessons,
		studentProgress
	} from '$lib/server/db/schema';
	import { onMount } from 'svelte';

	// Props
	let {
		subject,
		modules = [],
		currentModuleId,
		currentLessonId,
		lessons: allLessons = [],
		progress = {}
	} = $props<{
		subject: subjects;
		modules: modulesType[];
		currentModuleId: number;
		currentLessonId: number;
		lessons: lessons[];
		progress: Record<number, studentProgress>;
	}>();

	// Track expanded state for each module
	let expandedModules = $state<Record<number, boolean>>({});
	let previousModuleId = $state<number | null>(null);

	// Update expanded modules when currentModuleId changes
	$effect(() => {
		if (currentModuleId && currentModuleId !== previousModuleId) {
			// Close previous module if different from current
			if (previousModuleId && previousModuleId !== currentModuleId) {
				expandedModules[previousModuleId] = false;
			}

			// Open current module
			expandedModules[currentModuleId] = true;

			// Update previous module reference
			previousModuleId = currentModuleId;
		}
	});

	// Toggle module expansion
	function toggleModule(moduleId: number) {
		expandedModules[moduleId] = !expandedModules[moduleId];
	}

	// Get lessons for a specific module
	function getLessonsForModule(moduleId: number) {
		return allLessons
			.filter((lesson: { moduleId: number }) => lesson.moduleId === moduleId)
			.sort(
				(a: { orderInModule: any }, b: { orderInModule: any }) =>
					(a?.orderInModule || 0) - (b?.orderInModule || 0)
			);
	}

	// Check if a lesson is completed
	function isLessonCompleted(lessonId: number) {
		return progress[lessonId] != null && progress[lessonId].completedAt !== null;
	}
</script>

<div class="flex h-full w-64 flex-col rounded-lg bg-surface-50 shadow-md dark:bg-surface-800">
	<div class="flex h-full flex-col p-3">
		<header class="mb-3 border-b border-surface-200 pb-3 dark:border-surface-700">
			<h2 class="text-center text-lg font-semibold">{subject?.name || 'Lessons'}</h2>
		</header>

		<!-- Module list -->
		<div class="flex-1 overflow-y-auto pr-1">
			<ul class="space-y-3">
				{#each modules as module (module.id)}
					{@const isActive = module.id === currentModuleId}

					<li
						class="overflow-hidden rounded-lg bg-surface-100 shadow-sm dark:bg-surface-700
						{isActive ? 'ring-1 ring-tertiary-500' : ''}"
					>
						<!-- Module header -->
						<button
							class="flex w-full cursor-pointer items-center justify-between p-3 text-left
								{isActive
								? 'bg-tertiary-500 text-white dark:bg-tertiary-700'
								: 'hover:bg-tertiary-200 dark:hover:bg-tertiary-800'}"
							onclick={() => toggleModule(module.id)}
							aria-expanded={expandedModules[module.id]}
						>
							<span class="truncate font-medium">{module.name || 'Module'}</span>
							<div class="ml-1 flex-shrink-0">
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
									class="transition-transform duration-300"
									style="transform: {expandedModules[module.id]
										? 'rotate(180deg)'
										: 'rotate(0deg)'}"
								>
									<polyline points="6 9 12 15 18 9"></polyline>
								</svg>
							</div>
						</button>

						<!-- Lessons within module -->
						{#if expandedModules[module.id]}
							{@const moduleLessons = getLessonsForModule(module.id)}

							{#if moduleLessons.length > 0}
								<ul class="mt-1 space-y-1 p-2">
									{#each moduleLessons as lesson (lesson.id)}
										{@const isCompleted = isLessonCompleted(lesson.id)}
										{@const isCurrent = lesson.id === currentLessonId}

										<li>
											<a
												href={`/lessons/subject/${subject?.id || ''}/module/${module.id || ''}/lesson/${lesson.id || ''}`}
												class="flex items-center rounded-md p-2 text-left transition-colors
												{isCurrent
													? 'bg-tertiary-200 font-medium dark:bg-tertiary-900'
													: isCompleted
														? 'hover:bg-surface-200 dark:hover:bg-surface-600'
														: 'hover:bg-surface-200 dark:hover:bg-surface-600'}"
											>
												<div class="mr-2 flex-shrink-0">
													{#if isCompleted}
														<div
															class="flex h-5 w-5 items-center justify-center rounded-full bg-success-600 dark:bg-success-700"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="12"
																height="12"
																viewBox="0 0 24 24"
																fill="none"
																stroke="white"
																stroke-width="3"
																stroke-linecap="round"
																stroke-linejoin="round"
															>
																<polyline points="20 6 9 17 4 12"></polyline>
															</svg>
														</div>
													{:else}
														<div
															class="h-5 w-5 rounded-full border-2 border-surface-300 dark:border-surface-500
															{isCurrent ? 'border-tertiary-500 dark:border-tertiary-400' : ''}"
														></div>
													{/if}
												</div>
												<span class="truncate text-sm">{lesson.title || 'Lesson'}</span>
											</a>
										</li>
									{/each}
								</ul>
							{:else}
								<div class="p-3 text-center text-sm italic text-gray-500">No lessons available</div>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>

			{#if modules.length === 0}
				<div class="p-4 text-center text-gray-500">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="mx-auto mb-2 text-gray-400"
					>
						<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
						<polyline points="13 2 13 9 20 9"></polyline>
					</svg>
					<p>No modules available</p>
				</div>
			{/if}
		</div>
	</div>
</div>
