<script lang="ts">
	import { onMount } from 'svelte';

	let isLessonsPanelOpen = $state(true);
	let isCodePanelHorizontal = $state(false);

	let lessons = [
		{
			id: 'html-intro',
			title: 'Introduction to HTML',
			content: `<h1>Welcome to Hungry Stack!</h1>
	<p>This is your first HTML lesson.</p>`,
			next: 'html-structure',
			prev: null
		},
		{
			id: 'html-structure',
			title: 'HTML Structure & Elements',
			content: `<header>
	<h1>Website Header</h1>
  </header>
  <main>
	<p>Main content goes here.</p>
  </main>
  <footer>
	<p>Website Footer</p>
  </footer>`,
			next: 'html-links-images',
			prev: 'html-intro'
		},
		{
			id: 'html-links-images',
			title: 'Links & Images',
			content: `<a href="https://svelte.dev">Click here to visit Svelte!</a>
	<img src="https://files.idyllic.app/files/static/115812?width=256&optimizer=image" alt="A cute kitten">`,
			next: null,
			prev: 'html-structure'
		}
	];

	let currentLesson = $state(lessons[0]);
	let code = $state('');
	let iframeSrc = $state('');

	function loadLesson(lessonId: string) {
		const foundLesson = lessons.find((lesson) => lesson.id === lessonId);
		if (foundLesson) {
			currentLesson = foundLesson;
			code = foundLesson.content;
			updatePreview();
		}
	}

	function toggleLessonPanel() {
		isLessonsPanelOpen = !isLessonsPanelOpen;
	}

	function updatePreview() {
		iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(code)}`;
	}

	onMount(() => {
		code = currentLesson.content;
		updatePreview();
	});
</script>

<main class="flex min-h-screen w-full flex-col overflow-y-auto p-6 lg:flex-row">
	<!-- Collapsible Lessons Panel -->
	<div
		class="relative transition-all duration-300"
		class:w-64={isLessonsPanelOpen}
		class:w-0={!isLessonsPanelOpen}
	>
		<!-- Actual panel content with overflow handling -->
		<div
			class="absolute h-full overflow-hidden bg-surface-100 dark:bg-surface-800"
			class:w-64={isLessonsPanelOpen}
			class:w-0={!isLessonsPanelOpen}
		>
			<div class="p-4">
				<h2 class="mb-4 text-center text-lg font-semibold">Lessons</h2>
				<ul class="space-y-2">
					{#each lessons as lesson}
						<li
							class="cursor-pointer rounded-lg p-2 {lesson.id === currentLesson.id
								? 'bg-tertiary-500'
								: 'hover:bg-tertiary-300 dark:hover:bg-tertiary-900'}"
						>
							<button class="w-full text-left" onclick={() => loadLesson(lesson.id)}>
								{lesson.title}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Toggle Lesson Panel Button -->
		<button
			onclick={toggleLessonPanel}
			class="absolute -right-0 top-4 z-10 rounded-r bg-tertiary-500 p-1 text-white hover:bg-tertiary-600"
		>
			{#if isLessonsPanelOpen}
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
				<!-- ... button content ... -->
			</button>

			<!-- Code Editor -->
			<div class="flex-1">
				<h2 class="text-lg font-semibold">Code Editor</h2>
				<textarea
					class="h-60 w-full rounded-lg border bg-gray-50 p-3 font-mono dark:bg-gray-700"
					bind:value={code}
					oninput={updatePreview}
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
					onclick={() => currentLesson.prev && loadLesson(currentLesson.prev)}
				>
					← Previous
				</button>
			{/if}
			{#if currentLesson.next}
				<button
					class="rounded-lg bg-tertiary-500 px-4 py-2 hover:bg-tertiary-600"
					onclick={() => currentLesson.next && loadLesson(currentLesson.next)}
				>
					Next →
				</button>
			{/if}
		</div>
	</section>
</main>
<script lang="ts">
	import { onMount } from 'svelte';

	let isLessonsPanelOpen = $state(true);
	let isCodePanelHorizontal = $state(false);

	let lessons = [
		{
			id: 'html-intro',
			title: 'Introduction to HTML',
			content: `<h1>Welcome to Hungry Stack!</h1>
	<p>This is your first HTML lesson.</p>`,
			next: 'html-structure',
			prev: null
		},
		{
			id: 'html-structure',
			title: 'HTML Structure & Elements',
			content: `<header>
	<h1>Website Header</h1>
  </header>
  <main>
	<p>Main content goes here.</p>
  </main>
  <footer>
	<p>Website Footer</p>
  </footer>`,
			next: 'html-links-images',
			prev: 'html-intro'
		},
		{
			id: 'html-links-images',
			title: 'Links & Images',
			content: `<a href="https://svelte.dev">Click here to visit Svelte!</a>
	<img src="https://files.idyllic.app/files/static/115812?width=256&optimizer=image" alt="A cute kitten">`,
			next: null,
			prev: 'html-structure'
		}
	];

	let currentLesson = $state(lessons[0]);
	let code = $state('');
	let iframeSrc = $state('');

	function loadLesson(lessonId: string) {
		const foundLesson = lessons.find((lesson) => lesson.id === lessonId);
		if (foundLesson) {
			currentLesson = foundLesson;
			code = foundLesson.content;
			updatePreview();
		}
	}

	function toggleLessonPanel() {
		isLessonsPanelOpen = !isLessonsPanelOpen;
	}

	function updatePreview() {
		iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(code)}`;
	}

	onMount(() => {
		code = currentLesson.content;
		updatePreview();
	});
</script>

<main class="flex min-h-screen w-full flex-col overflow-y-auto p-6 lg:flex-row">
	<!-- Collapsible Lessons Panel -->
	<div
		class="relative transition-all duration-300"
		class:w-64={isLessonsPanelOpen}
		class:w-0={!isLessonsPanelOpen}
	>
		<!-- Actual panel content with overflow handling -->
		<div
			class="absolute h-full overflow-hidden bg-surface-100 dark:bg-surface-800"
			class:w-64={isLessonsPanelOpen}
			class:w-0={!isLessonsPanelOpen}
		>
			<div class="p-4">
				<h2 class="mb-4 text-center text-lg font-semibold">Lessons</h2>
				<ul class="space-y-2">
					{#each lessons as lesson}
						<li
							class="cursor-pointer rounded-lg p-2 {lesson.id === currentLesson.id
								? 'bg-tertiary-500'
								: 'hover:bg-tertiary-300 dark:hover:bg-tertiary-900'}"
						>
							<button class="w-full text-left" onclick={() => loadLesson(lesson.id)}>
								{lesson.title}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Toggle Lesson Panel Button -->
		<button
			onclick={toggleLessonPanel}
			class="absolute -right-0 top-4 z-10 rounded-r bg-tertiary-500 p-1 text-white hover:bg-tertiary-600"
		>
			{#if isLessonsPanelOpen}
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
				<!-- ... button content ... -->
			</button>

			<!-- Code Editor -->
			<div class="flex-1">
				<h2 class="text-lg font-semibold">Code Editor</h2>
				<textarea
					class="h-60 w-full rounded-lg border bg-gray-50 p-3 font-mono dark:bg-gray-700"
					bind:value={code}
					oninput={updatePreview}
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
					onclick={() => currentLesson.prev && loadLesson(currentLesson.prev)}
				>
					← Previous
				</button>
			{/if}
			{#if currentLesson.next}
				<button
					class="rounded-lg bg-tertiary-500 px-4 py-2 hover:bg-tertiary-600"
					onclick={() => currentLesson.next && loadLesson(currentLesson.next)}
				>
					Next →
				</button>
			{/if}
		</div>
	</section>
</main>