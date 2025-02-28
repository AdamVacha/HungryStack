<script lang="ts">
	// Module State Mangagement
	let isModulesPanelOpen = $state(true);
	let isCodePanelHorizontal = $state(true);

	let moduleCompletions = $state<Record<string, boolean>>({
		'm1-html-basics': false,
		'm2-html-intermediate': false
	});

	let moduleExpansions = $state<Record<string, boolean>>({
		'm1-html-basics': true,
		'm2-html-intermediate': false
	});

	let moduleLocks = $state<Record<string, boolean>>({
		'm1-html-basics': false,
		'm2-html-intermediate': true
	});

	let lessonCompletions = $state<Record<string, boolean>>({
		'm1-l1-html-intro-hello-headers': false,
		'm1-l2-html-paragraphs-text': false,
		'm1-l3-html-links-images': false,
		'm1-l4-html-full-page-structure': false,
		'm2-l1-html-intermediate': false
	});

	let modules = [
		{
			id: 'm1-html-basics',
			title: 'Module 1: HTML Basics',
			lessons: [
				{
					id: 'm1-l1-html-intro-hello-headers',
					title: 'HTML Introduction, Hello Headers!',
					content: `<h1>Welcome to Hungry Stack!</h1>
	<p>This is your first HTML lesson.</p>`,
					next: 'm1-l2-html-paragraphs-text',
					prev: null
				},
				{
					id: 'm1-l2-html-paragraphs-text',
					title: 'Paragraphs & Text',
					content: `<header>
					<h1>Website Header</h1>
				</header>
				<main>
					<p>Main content goes here.</p>
				</main>
				<footer>
					<p>Website Footer</p>
				</footer>`,
					next: 'm1-l3-html-links-images',
					prev: 'm1-l1-html-intro-hello-headers'
				},
				{
					id: 'm1-l3-html-links-images',
					title: 'Links & Images: Connecting Pages',
					content: `<a href="https://svelte.dev">Click here to visit Svelte!</a>
				<img src="https://files.idyllic.app/files/static/115812?width=256&optimizer=image" 
				// alt="A cute kitten">`,
					next: 'm1-l4-html-full-page-structure',
					prev: 'm1-l2-html-paragraphs-text'
				},
				{
					id: 'm1-l4-html-full-page-structure',
					title: 'First Full Page Structure',
					content: `<!DOCTYPE html>
				<html>
				<head>
					<title>My First Complete Page</title>
				</head>
				<body>
					<header>
						<h1>Welcome to My Website</h1>
						<nav>
							<ul>
								<li><a href="#home">Home</a></li>
								<li><a href="#about">About</a></li>
								<li><a href="#contact">Contact</a></li>
							</ul>
						</nav>
					</header>
					<main>
						<section id="home">
							<h2>Home Section</h2>
							<p>This is the main content of my page.</p>
							<img src="https://files.idyllic.app/files/static/115812?width=256&optimizer=image" 
							// alt="A cute kitten">
						</section>
					</main>
					<footer>
						<p>&copy; 2025 My Website</p>
					</footer>
				</body>
				</html>`,
					next: 'm2-html-intermediate',
					prev: 'm1-l3-html-links-images'
				}
			]
		},
		{
			id: 'm2-html-intermediate',
			title: 'Module 2: HTML Intermediate',
			lessons: [
				{
					id: 'm2-l1-html-intermediate',
					title: 'Welcome to Module 2!',
					content: `<h1>Module 2!</h1>
	<p>This is your first HTML lesson.</p>`,
					next: null,
					prev: null
				}
			]
		}
	];

	// Track current module / lesson / content
	let currentModule = $state(modules[0]);
	let currentLesson = $state(modules[0].lessons[0]);
	let code = $state(modules[0].lessons[0].content);
	let iframeSrc = $derived(`data:text/html;charset=utf-8,${encodeURIComponent(code)}`);

	// module completion
	function checkModuleCompletion(moduleId: string) {
		const module = modules.find((m) => m.id === moduleId);

		// if module not found, then return
		if (!module) return;

		// check completion status
		const allCompleted = module.lessons.every((lesson) => lessonCompletions[lesson.id]);

		// update module completion state
		moduleCompletions[moduleId] = allCompleted;

		// module completed? unlock next module
		if (allCompleted) {
			const currentIndex = modules.findIndex((m) => m.id === moduleId);
			if (currentIndex < modules.length - 1) {
				moduleLocks[modules[currentIndex + 1].id] = false;
			}
		}
	}

	// load lesson function
	function loadLesson(moduleId: string, lessonId: string) {
		// find module and lesson
		const foundModule = modules.find((m) => m.id === moduleId);
		if (!foundModule) return;

		const foundLesson = foundModule.lessons.find((m) => m.id === lessonId);
		if (foundLesson) {
			if (moduleLocks[moduleId]) return;

			currentModule = foundModule;
			currentLesson = foundLesson;
			code = foundLesson.content;
		}
	}

	// mark current lesson as completed
	function markLessonComplete() {
		lessonCompletions[currentLesson.id] = true;
		checkModuleCompletion(currentModule.id);
	}

	// unlock next module
	function expandModule(moduleId: string) {
		if (!moduleLocks[moduleId]) {
			moduleExpansions[moduleId] = !moduleExpansions[moduleId];
		}
	}

	function toggleModulesPanel() {
		isModulesPanelOpen = !isModulesPanelOpen;
	}

	function goToNextLesson() {
		markLessonComplete();

		if (currentLesson.next) {
			const nextLessonInModule = currentModule.lessons.find((l) => l.id === currentLesson.next);

			// check current module
			if (nextLessonInModule) {
				loadLesson(currentModule.id, currentLesson.next);
				return;
			}
			// check other modules
			for (const module of modules) {
				const lesson = module.lessons.find((l) => l.id === currentLesson.next);
				if (lesson && !moduleLocks[module.id]) {
					loadLesson(module.id, lesson.id);
					break;
				}
			}
		}
	}

	function goToPreviousLesson() {
		if (currentLesson.prev) {
			const prevLessonInModule = currentModule.lessons.find((l) => l.id === currentLesson.prev);

			if (prevLessonInModule) {
				loadLesson(currentModule.id, currentLesson.prev);
				return;
			}

			for (const module of modules) {
				const lesson = module.lessons.find((l) => l.id === currentLesson.prev);
				if (lesson && !moduleLocks[module.id]) {
					loadLesson(module.id, lesson.id);
					break;
				}
			}
		}
	}
</script>

<main class="flex min-h-screen w-full flex-col overflow-y-auto p-6 lg:flex-row">
	<!-- Collapsible Modules Panel -->
	<div
		class="relative transition-all duration-300"
		class:w-64={isModulesPanelOpen}
		class:w-0={!isModulesPanelOpen}
	>
		<!-- Actual panel content with overflow handling -->
		<div
			class="absolute h-full overflow-auto bg-surface-100 dark:bg-surface-800"
			class:w-64={isModulesPanelOpen}
			class:w-0={!isModulesPanelOpen}
		>
			<div class="p-4">
				<h2 class="mb-4 text-center text-lg font-semibold">Lessons</h2>

				<!-- Module list -->
				<ul class="space-y-4">
					{#each modules as module}
						<li class="rounded-lg bg-surface-200 dark:bg-surface-700">
							<!-- Module header -->
							<button
								class="flex w-full cursor-pointer items-center justify-between rounded-t-lg p-2 text-left {moduleLocks[
									module.id
								]
									? 'bg-gray-400 dark:bg-gray-600'
									: moduleCompletions[module.id]
										? 'bg-green-500 dark:bg-green-700'
										: 'bg-tertiary-500 dark:bg-tertiary-700'}"
								onclick={() => expandModule(module.id)}
								disabled={moduleLocks[module.id]}
								aria-expanded={moduleExpansions[module.id]}
							>
								<span class="font-semibold">{module.title}</span>
								<div class="flex items-center">
									{#if moduleCompletions[module.id]}
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
											<path d="M20 6L9 17l-5-5" />
										</svg>
									{/if}
									{#if moduleLocks[module.id]}
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
											<path d={moduleExpansions[module.id] ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
										</svg>
									{/if}
								</div>
							</button>

							<!-- Lessons within module -->
							{#if moduleExpansions[module.id] && !moduleLocks[module.id]}
								<ul class="mt-1 space-y-1 p-2">
									{#each module.lessons as lesson}
										<li
											class="cursor-pointer rounded p-2 {lesson.id === currentLesson.id
												? 'bg-tertiary-300 dark:bg-tertiary-900'
												: lessonCompletions[lesson.id]
													? 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'
													: 'hover:bg-tertiary-100 dark:hover:bg-tertiary-800'}"
										>
											<button
												class="flex w-full items-center justify-between text-left"
												onclick={() => loadLesson(module.id, lesson.id)}
											>
												<span>{lesson.title}</span>
												{#if lessonCompletions[lesson.id]}
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
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
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

	<!-- Main Content Section -->
	<section class="flex-1 rounded-lg bg-white p-4 shadow dark:bg-gray-900">
		<h1 class="text-3xl font-bold">{currentLesson.title}</h1>
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
			{#if currentLesson.prev}
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

			{#if !lessonCompletions[currentLesson.id]}
				<button
					class="rounded-lg bg-green-500 px-4 py-2 hover:bg-green-600"
					onclick={markLessonComplete}
				>
					Mark as Completed
				</button>
			{/if}

			{#if currentLesson.next}
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
	</section>
</main>
