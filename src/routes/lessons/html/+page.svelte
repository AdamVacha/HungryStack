<script lang="ts">
	import { onMount } from 'svelte';

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

	let currentLesson = lessons[0];
	let code = currentLesson.content;
	let iframeSrc = '';

	function loadLesson(lessonId: string) {
		let foundLesson = lessons.find((lesson) => lesson.id === lessonId);
		if (foundLesson) {
			currentLesson = foundLesson;
			code = currentLesson.content;
			updatePreview();
		}
	}

	function updatePreview() {
		iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(code)}`;
	}

	onMount(() => {
		updatePreview();
	});
</script>

<main class="flex min-h-screen w-full flex-col p-6 lg:flex-row">
	<!-- Lessons List -->
	<aside class="mr-4 w-full rounded-lg bg-surface-100 p-4 shadow lg:w-1/5 dark:bg-surface-800">
		<h2 class="mb-4 text-center text-lg font-semibold">Lessons</h2>
		<ul class="space-y-2">
			{#each lessons as lesson}
				<li
					class="cursor-pointer rounded-lg p-2 {lesson.id === currentLesson.id
						? 'bg-tertiary-500'
						: 'hover:bg-tertiary-300 dark:hover:bg-tertiary-900'}"
				>
					<button class="w-full text-left" on:click={() => loadLesson(lesson.id)}>
						{lesson.title}
					</button>
				</li>
			{/each}
		</ul>
	</aside>

	<!-- Lesson Content -->
	<section class="w-full rounded-lg bg-white p-4 shadow lg:w-4/5 dark:bg-gray-900">
		<h1 class="text-3xl font-bold">{currentLesson.title}</h1>
		<p>Modify the code below and see the result in real time!</p>

		<!-- Code Editor -->
		<div class="mt-4">
			<h2 class="text-lg font-semibold">Code Editor</h2>
			<textarea
				class="h-48 w-full rounded-lg border bg-gray-50 p-3 font-mono dark:bg-gray-700"
				bind:value={code}
				on:input={updatePreview}
			></textarea>
		</div>

		<!-- Live Preview -->
		<div class="mt-4">
			<h2 class="text-lg font-semibold">Live Preview</h2>
			<iframe src={iframeSrc} class="h-96 w-full rounded-lg border bg-white" title="Live Preview"
			></iframe>
		</div>

		<!-- Navigation Buttons -->
		<div class="mt-4 flex justify-between">
			{#if currentLesson.prev}
				<button
					class="rounded-lg bg-gray-400 px-4 py-2 hover:bg-gray-500 dark:bg-gray-600"
					on:click={() => currentLesson.prev && loadLesson(currentLesson.prev)}>← Previous</button
				>
			{/if}
			{#if currentLesson.next}
				<button
					class="rounded-lg bg-tertiary-500 px-4 py-2 hover:bg-tertiary-600"
					on:click={() => currentLesson.next && loadLesson(currentLesson.next)}>Next →</button
				>
			{/if}
		</div>
	</section>
</main>
