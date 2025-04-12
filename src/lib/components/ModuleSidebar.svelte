<script lang="ts">
	import {
		type subjects,
		type modules as modulesType,
		type lessons,
		type studentProgress
	} from '$lib/server/db/schema';

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
		modules: modules[];
		currentModuleId: number;
		currentLessonId: number;
		lessons: lessons[];
		progress: Record<number, studentProgress>;
	}>();

	// Track expanded state for each module
	let expandedModules = $state<Record<number, boolean>>({});

	// Initialize expanded state for current module
	$effect(() => {
		if (currentModuleId && !expandedModules[currentModuleId]) {
			expandedModules[currentModuleId] = true;
		}
	});

	// Toggle module expansion
	function toggleModule(moduleId: number) {
		expandedModules[moduleId] = !expandedModules[moduleId];
	}

	// Get lessons for a specific module
	function getLessonsForModule(moduleId: number) {
		return allLessons
			.filter((lesson) => lesson.moduleId === moduleId)
			.sort((a, b) => (a?.orderInModule || 0) - (b?.orderInModule || 0));
	}

	// Check if a lesson is completed
	function isLessonCompleted(lessonId: number) {
		// Explicitly check if progress entry exists AND its completedAt is not null
		return progress[lessonId] != null && progress[lessonId].completedAt !== null;
	}
</script>

<div class="w-64 h-full rounded-lg bg-surface-100 dark:bg-surface-800 flex flex-col">
	<div class="p-2 flex flex-col h-full">
		<h2 class="mb-4 text-center text-lg font-semibold flex-shrink-0">Lessons</h2>

		<!-- Module list -->
		<div class="overflow-y-auto flex-1">
			<ul class="space-y-2">
				{#each modules as module (module.id)}
					<li class="rounded-lg bg-surface-200 dark:bg-surface-700">
						<!-- Module header -->
						<button
							class="flex w-full cursor-pointer items-center justify-between rounded-md p-2 text-left
							{module.id === currentModuleId
								? 'bg-secondary-400 dark:bg-secondary-500'
								: 'bg-tertiary-500 dark:bg-tertiary-700'}"
							onclick={() => toggleModule(module.id)}
							aria-expanded={expandedModules[module.id]}
						>
							<span class="font-semibold">{module.name || 'Module'}</span>
							<div class="flex items-center">
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
									<path d={expandedModules[module.id] ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
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

										<li
											class="cursor-pointer rounded p-2 {isCurrent
												? 'bg-tertiary-300 dark:bg-tertiary-900'
												: isCompleted
													? 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'
													: 'hover:bg-tertiary-100 dark:hover:bg-tertiary-800'}"
										>
											<a
												href={`/lessons/subject/${subject?.id || ''}/module/${module.id || ''}/lesson/${lesson.id || ''}`}
												class="flex w-full items-center justify-between text-left"
											>
												<span class="truncate pr-2">{lesson.title || 'Lesson'}</span>
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
														class="flex-shrink-0"
													>
														<path d="M20 6L9 17l-5-5" />
													</svg>
												{/if}
											</a>
										</li>
									{/each}
								</ul>
							{:else}
								<div class="p-2 text-center text-sm italic text-gray-500">No lessons available</div>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>

			{#if modules.length === 0}
				<div class="mt-4 text-center text-gray-500">No modules available</div>
			{/if}
		</div>
	</div>
</div>