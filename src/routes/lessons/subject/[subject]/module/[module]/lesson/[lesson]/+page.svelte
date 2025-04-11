<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import {
		showBadgeNotification,
		showMultipleBadgeNotifications
	} from '$lib/badges/badgeNotification';
	import BadgeNotification from '$lib/components/BadgeNotification.svelte';
	import { awardModuleCompletionBadges, hasBadge, refreshBadgeData } from '$lib/badges/badgeStore';

	// CodeMirror imports
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap, indentWithTab } from '@codemirror/commands';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { css } from '@codemirror/lang-css';
	import { sql } from '@codemirror/lang-sql';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { page } from '$app/state';
	import { moduleToBasicBadgeMap, badgeMap, type Badge } from '$lib/badges/badgeSystem';

	// Get page data from loader
	let { data } = $props<{ data: PageData }>();

	// Using derived for data properties
	let lesson = $derived(data?.lesson);
	let module = $derived(data?.module);
	let subject = $derived(data?.subject);

	// CodeMirror editor state
	let editorContainer: HTMLDivElement | null = null;
	let editorView: EditorView;

	// Local state for editor - initialize with a default value first
	let code = $state('');
	let isCodePanelHorizontal = $state(true);

	// Set initial code value after lesson data is available
	$effect(() => {
		console.log('Lesson content changed:', lesson?.content);
		if (lesson?.content) {
			// Update the code state
			code = lesson.content;

			// Destroy existing editor if it exists
			if (editorView) {
				editorView.destroy();
			}

			// Then recreate the editor
			requestAnimationFrame(() => {
				createCodeMirrorEditor();
				updateEditorContent(lesson.content);
			});
		}
	});

	// Determine language extensions based on subject
	function getLanguageExtension() {
		switch (subject?.id) {
			case 1:
				return html(); // HTML
			case 2:
				return css(); // CSS
			case 3:
				return javascript(); // JavaScript
			case 4:
				return sql(); // SQL
			default:
				return javascript();
		}
	}

	// Create CodeMirror editor
	function createCodeMirrorEditor() {
		// Remove existing editor if it exists
		if (editorView) {
			editorView.destroy();
		}

		// Configure codemirror editor with appropriate language
		editorView = new EditorView({
			doc: code,
			extensions: [
				basicSetup,
				EditorView.lineWrapping,
				keymap.of([...defaultKeymap, indentWithTab]),
				getLanguageExtension(),
				oneDark,
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						code = update.state.doc.toString();
						updateIframePreview();
					}
				})
			],
			parent: editorContainer!
		});
	}

	// Update codemirror editor content programmatically
	function updateEditorContent(newContent: string) {
		if (editorView) {
			const transaction = editorView.state.update({
				changes: {
					from: 0,
					to: editorView.state.doc.length,
					insert: newContent
				}
			});
			editorView.dispatch(transaction);
		}
	}

	// init iframe
	let iframeSrc = $derived(`data:text/html;charset=utf-8,${encodeURIComponent(code)}`);

	// Progress tracking
	let isCompleted = $state(data?.progress ? data.progress.completedAt !== null : false);
	let timeSpent = $state(0);
	let timeTracker: number | undefined;

	// Start tracking time spent on the lesson
	onMount(() => {
		createCodeMirrorEditor();

		timeTracker = window.setInterval(() => {
			timeSpent += 1;
		}, 1000);

		return () => {
			if (editorView) {
				editorView.destroy();
			}
			if (timeTracker) clearInterval(timeTracker);
		};
	});

	// Mark lesson as completed
	async function markLessonComplete() {
		if (isCompleted || !lesson?.id) return;

		try {
			// Create FormData
			const formData = new FormData();
			formData.append('timeSpent', timeSpent.toString());

			// Use the form action
			const response = await fetch(`?/markComplete`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`Failed to mark lesson as complete: ${response.statusText}`);
			}

			isCompleted = true;

			// Parse result
			const result = await response.json();
			console.log('Server response:', result);

			try {
				// Parse the response data if needed
				let parsedData;
				if (typeof result.data === 'string') {
					parsedData = JSON.parse(result.data);
				} else {
					parsedData = result.form || result;
				}

				// Check for module completion
				const moduleCompleted =
					result.form?.moduleCompleted === 1 ||
					(parsedData[0] && parsedData[0].moduleCompleted === 1);

				if (moduleCompleted && module?.id) {
					console.log(`Module ${module.id} was completed!`);

					// Get badge ID for this module
					const badgeId = moduleToBasicBadgeMap[module.id.toString()];

					if (badgeId) {
						// Get badge details from the badge map
						const badgeDetails = badgeMap.get(badgeId);

						if (badgeDetails) {
							// Create a badge object with current date
							const badge: Badge = {
								...badgeDetails,
								dateEarned: new Date()
							};

							console.log('Showing badge notification for module completion:', badge);
							showBadgeNotification(badge);

							// For stack-starter badge (first module completion)
							const hasStackStarterBadge = hasBadge('stack-starter');
							if (!hasStackStarterBadge) {
								const stackStarterBadge = badgeMap.get('stack-starter');
								if (stackStarterBadge) {
									setTimeout(() => {
										const badge: Badge = {
											...stackStarterBadge,
											dateEarned: new Date()
										};
										showBadgeNotification(badge);
									}, 2000);
								}
							}
						}
					}

					// Refresh badges from server (in background, after showing notifications)
					refreshBadgeData();
				}

				// Check if this was the first lesson completion
				const firstLesson = parsedData[0] && parsedData[0].success === 1 && !moduleCompleted;

				if (firstLesson) {
					// Show first-bite badge if user doesn't already have it
					const hasFirstBiteBadge = hasBadge('first-bite');
					if (!hasFirstBiteBadge) {
						const firstBiteBadge = badgeMap.get('first-bite');
						if (firstBiteBadge) {
							const badge: Badge = {
								...firstBiteBadge,
								dateEarned: new Date()
							};
							console.log('Showing first-bite badge notification:', badge);
							showBadgeNotification(badge);
						}
					}
				}
			} catch (parseError) {
				console.error('Error processing badge notifications:', parseError);
			}
		} catch (error) {
			console.error('Failed to mark lesson as complete:', error);
		}
	}

	// Update iframe preview
	function updateIframePreview() {
		const iframe = document.getElementById('live-preview-iframe') as HTMLIFrameElement;
		if (iframe) {
			iframe.src = `data:text/html;charset=utf-8,${encodeURIComponent(code)}`;
		}
	}

	// Navigation functions
	async function goToNextLesson() {
		await markLessonComplete();

		if (lesson?.nextLessonId) {
			window.location.href = `/lessons/subject/${subject.id}/module/${module.id}/lesson/${lesson.nextLessonId}`;
		}
	}

	async function goToPreviousLesson() {
		if (lesson?.prevLessonId) {
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
		<div class:hidden={lesson?.id !== 1}>
			<p>Modify the code below and see the result in real time!</p>
		</div>
	</header>

	<!-- Code Editor and Preview -->
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

			<div bind:this={editorContainer} class="max-h-screen w-full overflow-auto"></div>
		</div>

		<!-- Live Preview -->
		<div class="overflow-hidden rounded-lg">
			<header class="bg-surface-100 px-4 py-2 dark:bg-gray-700">
				<h2 class="text-lg font-medium">Live Preview</h2>
			</header>
			<div class="max-h-screen bg-white">
				<iframe
					id="live-preview-iframe"
					src={iframeSrc}
					class="h-screen w-full border-0"
					title="Live Preview"
				></iframe>
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
			<button
				class="rounded-lg px-6 py-3 font-medium text-white transition-colors"
				class:bg-green-600={!isCompleted}
				class:hover:bg-green-500={!isCompleted}
				class:bg-gray-400={isCompleted}
				class:hover:bg-gray-400={isCompleted}
				onclick={!isCompleted ? markLessonComplete : () => {}}
				disabled={isCompleted}
			>
				{isCompleted ? 'Completed ✓' : 'Mark as Completed'}
			</button>
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
