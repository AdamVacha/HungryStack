<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import BadgeNotification from '$lib/components/BadgeNotification.svelte';
	import { goto } from '$app/navigation';
	import { refreshBadgeData } from '$lib/badges/badges';
	import { showBadgeNotification } from '$lib/badges/badgeNotification';
	import Confetti from '$lib/components/Confetti.svelte';
	// CodeMirror imports
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap, indentWithTab } from '@codemirror/commands';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { css } from '@codemirror/lang-css';
	import { sql } from '@codemirror/lang-sql';
	import { oneDark } from '@codemirror/theme-one-dark';

	// Get page data from loader
	let { data } = $props<{ data: PageData }>();

	// Using derived for data properties
	let lesson = $derived(data?.lesson);
	let module = $derived(data?.module);
	let subject = $derived(data?.subject);
	let navigation = $derived(data?.navigation || { next: null, prev: null });

	// CodeMirror editor state
	let editorContainer: HTMLDivElement | null = null;
	let editorView: EditorView;

	// Local state for editor and UI
	let code = $state('');
	let isCodePanelHorizontal = $state(false);
	let isCompleted = $state(data?.progress ? data.progress.completedAt !== null : false);
	let timeSpent = $state(0);
	let timeTracker: number | undefined;

	let confettiComponent: Confetti;

	// Set initial code value after lesson data is available
	$effect(() => {
		if (lesson?.id) {
			// Reset completion status when lesson changes
			isCompleted = data?.progress ? data.progress.completedAt !== null : false;
		}
		if (lesson?.content) {
			// Update the code state
			code = lesson.content;

			// Destroy existing editor if it exists
			if (editorView) {
				editorView.destroy();
			}

			// Then recreate the editor
			if (typeof window !== 'undefined') {
				requestAnimationFrame(() => {
					createCodeMirrorEditor();
					updateEditorContent(lesson.content);
				});
			}
		}
	});
	function handleConfettiComplete() {
		console.log('Confetti animation completed');
	}

	function handleConfettiError(error: any) {
		console.error('Error in confetti animation:', error);
	}

	function playConfettiAnimation() {
		if (confettiComponent) {
			confettiComponent.playConfetti();
		} else {
			console.error('Confetti component not available');
		}
	}

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

	// Handle window resize for responsive layout
	function handleResize() {
		if (typeof window !== 'undefined') {
			const newIsHorizontal = window.innerWidth >= 768;
			if (newIsHorizontal !== isCodePanelHorizontal) {
				isCodePanelHorizontal = newIsHorizontal;
			}
		}
	}

	// Update iframe preview
	function updateIframePreview() {
		if (typeof document !== 'undefined') {
			const iframe = document.getElementById('live-preview-iframe') as HTMLIFrameElement;
			if (iframe) {
				iframe.src = `data:text/html;charset=utf-8,${encodeURIComponent(code)}`;
			}
		}
	}

	// Initialize iframe
	let iframeSrc = $derived(`data:text/html;charset=utf-8,${encodeURIComponent(code)}`);

	// Start tracking time spent on the lesson
	onMount(() => {
		isCodePanelHorizontal = window.innerWidth >= 768;

		createCodeMirrorEditor();

		// Add resize listener
		window.addEventListener('resize', handleResize);

		timeTracker = window.setInterval(() => {
			timeSpent += 1;
		}, 1000);

		return () => {
			if (editorView) {
				editorView.destroy();
			}
			if (timeTracker) clearInterval(timeTracker);
			window.removeEventListener('resize', handleResize);
		};
	});

	async function markLessonComplete() {
		if (isCompleted || !lesson?.id) return;

		try {
			// Create FormData for the request
			const requestFormData = new FormData();
			requestFormData.append('timeSpent', timeSpent.toString());

			// Use the form action
			const response = await fetch(`?/markComplete`, {
				method: 'POST',
				body: requestFormData
			});

			if (!response.ok) {
				throw new Error(`Failed to mark lesson as complete: ${response.statusText}`);
			}

			isCompleted = true;

			// Parse result
			const result = await response.json();

			console.log('Lesson completion result:', result);

			const resultProperties = Object.keys(result);
			console.log('Result properties:', resultProperties);

			let shouldPlayConfetti = false;

			if (typeof result.data === 'string') {
				try {
					const parsedData = JSON.parse(result.data);
					console.log('Parsed result.data:', parsedData);

					if (Array.isArray(parsedData) && parsedData.length > 13) {
						const possibleCertificate = parsedData[13];
						if (
							possibleCertificate &&
							typeof possibleCertificate === 'object' &&
							possibleCertificate.title &&
							possibleCertificate.templateImage
						) {
							console.log('Certificate found in parsed array:', possibleCertificate);
							shouldPlayConfetti = true;
						}
						if (
							parsedData[14] &&
							typeof parsedData[14] === 'string' &&
							parsedData[14].includes('Master')
						) {
							console.log('Certificate title found in array:', parsedData[14]);
							shouldPlayConfetti = true;
						}

						if (
							parsedData[0] &&
							typeof parsedData[0] === 'object' &&
							parsedData[0].moduleCompleted === 1
						) {
							console.log('Module completion found in array:', parsedData[0]);
							shouldPlayConfetti = true;
						}

						if (parsedData[1] === true) {
							console.log('Subject completion flag found in array');
							shouldPlayConfetti = true;
						}
					}
				} catch (parseError) {
					console.error('Error parsing result.data:', parseError);
				}
			}

			if (shouldPlayConfetti) {
				console.log('Playing confetti animation!');
				setTimeout(() => {
					playConfettiAnimation();
				}, 500); // Short delay to ensure UI is updated first
			} else {
				console.log('No conditions met for playing confetti');
			}

			// Process badge notifications
			processBadgeNotifications(result);

			// Refresh badge data in background
			await refreshBadgeData();

			try {
				const { refreshCertificateData } = await import('$lib/certificates/certificateStore');
				await refreshCertificateData();
			} catch (certificateError) {
				console.error('Error refreshing certificate data:', certificateError);
			}

			return result;
		} catch (error) {
			console.error('Failed to mark lesson as complete:', error);
			return null;
		}
	}
	/**
	 * Process badge notifications from server response
	 */
	function processBadgeNotifications(result: { data: string }) {
		if (result?.data && typeof result.data === 'string') {
			try {
				const parsedData = JSON.parse(result.data);

				// Check if we have badge data in the response
				if (parsedData[4] && typeof parsedData[4] === 'string') {
					const badge = {
						id: parsedData[4],
						title: parsedData[5] || 'New Badge',
						description: parsedData[6] || 'You earned a new badge!',
						image: parsedData[7] || `/badges/${parsedData[4]}.png`,
						category: parsedData[8] || 'achievement',
						dateEarned: new Date()
					};

					// Show notification for this badge
					setTimeout(() => {
						showBadgeNotification(badge);
					}, 500);
				}
			} catch (error) {
				console.error('Error processing badge notification:', error);
			}
		}
	}

	/**
	 * Navigate to the next lesson
	 */
	async function goToNextLesson() {
		// Mark the lesson complete if it's not already
		if (!isCompleted) {
			await markLessonComplete();
		}

		const nextInfo = navigation.next;
		if (nextInfo && nextInfo.lessonId) {
			const nextModuleId = nextInfo.moduleId || module.id;

			goto(`/lessons/subject/${subject.id}/module/${nextModuleId}/lesson/${nextInfo.lessonId}`, {
				noScroll: true,
				replaceState: false
			});
		}
	}

	/**
	 * Navigate to the previous lesson
	 */
	async function goToPreviousLesson() {
		const prevInfo = navigation.prev;
		if (prevInfo && prevInfo.lessonId) {
			const prevModuleId = prevInfo.moduleId || module.id;

			goto(`/lessons/subject/${subject.id}/module/${prevModuleId}/lesson/${prevInfo.lessonId}`, {
				noScroll: true,
				replaceState: false
			});
		}
	}
</script>

<BadgeNotification />
<Confetti
	bind:this={confettiComponent}
	onComplete={handleConfettiComplete}
	onError={handleConfettiError}
/>

<div
	class="flex h-screen w-full flex-1 flex-col overflow-hidden rounded-lg bg-surface-300 p-2 shadow-lg sm:p-4 md:p-6 dark:bg-gray-900"
>
	<header class="mb-2 sm:mb-4 md:mb-6">
		<div class="mb-1 flex items-center justify-between">
			<h1 class="truncate text-xl font-bold sm:text-2xl md:text-3xl">
				{lesson?.title || 'Loading...'}
			</h1>
		</div>
		<div
			class:hidden={lesson?.id !== 1 || lesson?.id !== 29 || lesson?.id !== 58 || lesson?.id !== 82}
		>
			<p class="text-sm sm:text-base">Modify the code below and see the result in real time!</p>
		</div>
	</header>

	<!-- Code Editor and Preview -->
	<div
		class="grid flex-1 gap-2 overflow-hidden sm:gap-4 md:gap-6"
		class:grid-cols-1={!isCodePanelHorizontal}
		class:grid-rows-2={!isCodePanelHorizontal}
		class:grid-cols-2={isCodePanelHorizontal}
	>
		<!-- Code Editor -->
		<div
			class="flex min-h-[200px] flex-col overflow-hidden rounded-lg bg-surface-100 dark:bg-gray-800"
		>
			<header class="flex items-center justify-between px-2 py-1 sm:px-4 sm:py-2 dark:bg-gray-700">
				<h2 class="text-base font-medium sm:text-lg">Code Editor</h2>
				<button
					onclick={() => (isCodePanelHorizontal = !isCodePanelHorizontal)}
					class="rounded p-1 transition-colors hover:bg-gray-600"
					title={isCodePanelHorizontal
						? 'Switch to Vertical Layout'
						: 'Switch to Horizontal Layout'}
				>
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
						class="sm:h-5 sm:w-5"
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

			<div bind:this={editorContainer} class="w-full flex-1 overflow-auto"></div>
		</div>

		<!-- Live Preview -->
		<div class="flex min-h-[200px] flex-col overflow-hidden rounded-lg">
			<header class="bg-surface-100 px-2 py-1 sm:px-4 sm:py-2 dark:bg-gray-700">
				<h2 class="text-base font-medium sm:text-lg">Live Preview</h2>
			</header>
			<div class="flex-1 bg-white">
				<iframe
					id="live-preview-iframe"
					src={iframeSrc}
					class="h-full w-full border-0"
					title="Live Preview"
				></iframe>
			</div>
		</div>
	</div>

	<!-- Navigation Buttons -->
	<footer class="mt-2 flex justify-between sm:mt-4 md:mt-6">
		<button
			class="flex items-center gap-1 rounded-lg bg-gray-700 px-2 py-2 text-sm text-white transition-colors hover:bg-gray-600 sm:gap-2 sm:px-4 sm:py-3 sm:text-base md:px-6"
			onclick={goToPreviousLesson}
			disabled={!lesson?.prevLessonId}
			class:opacity-50={!lesson?.prevLessonId}
			class:cursor-not-allowed={!lesson?.prevLessonId}
		>
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
				class="sm:h-5 sm:w-5"
			>
				<path d="m15 18-6-6 6-6" />
			</svg>
			<span class="xs:inline hidden">Previous</span>
		</button>

		<div>
			<button
				class="rounded-lg px-2 py-2 text-sm font-medium text-white transition-colors sm:px-4 sm:py-3 sm:text-base md:px-6"
				class:bg-green-600={!isCompleted}
				class:hover:bg-green-500={!isCompleted}
				class:bg-gray-400={isCompleted}
				class:hover:bg-gray-400={isCompleted}
				onclick={!isCompleted ? markLessonComplete : () => {}}
				disabled={isCompleted}
			>
				{isCompleted ? 'Completed ✓' : 'Mark Complete'}
			</button>
		</div>

		<button
			class="flex items-center gap-1 rounded-lg bg-tertiary-500 px-2 py-2 text-sm text-white transition-colors hover:bg-tertiary-400 sm:gap-2 sm:px-4 sm:py-3 sm:text-base md:px-6"
			onclick={goToNextLesson}
			disabled={!lesson?.nextLessonId}
			class:opacity-50={!lesson?.nextLessonId}
			class:cursor-not-allowed={!lesson?.nextLessonId}
		>
			<span class="xs:inline hidden">Next</span>
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
				class="sm:h-5 sm:w-5"
			>
				<path d="m9 18 6-6-6-6" />
			</svg>
		</button>
	</footer>
</div>

<style>
	@media (min-width: 480px) {
		.xs\:inline {
			display: inline;
		}
	}
</style>
