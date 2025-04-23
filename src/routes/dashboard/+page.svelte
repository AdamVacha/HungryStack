<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import BadgeDisplay from '$lib/components/BadgeDisplay.svelte';
	import CertificateDisplay from '$lib/components/CertificateDisplay.svelte';

	let username = page?.data?.session?.user?.name ?? 'Guest';

	// Get progress data from page data using $ rune
	let progressData = $derived(page.data.progressData || {});

	// Define type for nextLessonLinks
	type LessonLinks = {
		html: string | null;
		css: string | null;
		javascript: string | null;
		backend: string | null;
		[key: string]: string | null;
	};

	// Initialize with default values
	let progress = $state({
		html: 0,
		css: 0,
		javascript: 0,
		backend: 0
	});

	// Set up next lesson links
	let nextLessonLinks = $state<LessonLinks>({
		html: null,
		css: null,
		javascript: null,
		backend: null
	});

	// Update progress when progressdata changes
	$effect(() => {
		progress.html = progressData.html?.progress || 0;
		progress.css = progressData.css?.progress || 0;
		progress.javascript = progressData.javascript?.progress || 0;
		progress.backend = progressData.backend?.progress || 0;
	});

	// Update links when progressdata changes
	$effect(() => {
		Object.keys(progressData).forEach((subject: string) => {
			const data = progressData[subject];
			if (data && data.nextLessonId) {
				nextLessonLinks[subject] =
					`/lessons/subject/${data.subjectId}/module/${data.nextModuleId}/lesson/${data.nextLessonId}`;
			}
		});
	});

	let messages = {
		default: `Welcome, ${username}!<br> Keep stacking your pancakes!`,
		html: 'HTML is the backbone of web pages. It structures your content!',
		css: 'CSS makes the web beautiful! Learn how to style your pages.',
		javascript: 'JavaScript brings web pages to life! Make them interactive.',
		backend: 'Backend development handles databases and server logic.'
	};

	type MessageKey = keyof typeof messages;

	let speechBubbleText = $state(messages.default);

	// Function to update message when hovering over a pancake
	function updateMessage(category: MessageKey) {
		speechBubbleText = messages[category] || messages.default;
	}

	/** Navigate to the appropriate lesson for the given subject
	 * @param {string} subject
	 */
	function navigateToLesson(subject: string) {
		// Get the data for this subject
		const subjectData = progressData[subject];

		// Go to last uncompleted lesson
		if (nextLessonLinks[subject]) {
			goto(nextLessonLinks[subject] as string);
		} else {
			// Or go to first lesson of first module if all lessons complete
			goto(
				`/lessons/subject/${subjectData.subjectId}/module/${subjectData.firstModuleInSubject}/lesson/${subjectData.firstLessonInSubject}`
			);
		}
	}
</script>

<main class="min-h-screen px-4 py-6 md:px-6 md:py-8 lg:py-10">
	<section
		class="grid grid-cols-1 items-center justify-center gap-8 md:grid-cols-2 md:py-6 lg:grid-cols-10"
	>
		<!-- Welcome Message Column -->
		<section class="flex justify-center md:col-span-1 lg:col-span-3">
			<div class="flex flex-col items-center md:space-x-4 md:p-4">
				<!-- Speech Bubble -->
				<div class="speech-bubble mx-auto mb-4 w-full max-w-xs">
					<p>
						{@html speechBubbleText}
					</p>
				</div>
				<img
					src="/images/mascot.png"
					alt="Mascot"
					class="relative h-48 animate-bounce md:h-64 lg:h-80"
				/>
			</div>
		</section>

		<!-- Pancake Stack Column -->
		<section class="px-4 md:col-span-1 md:p-4 lg:col-span-7 lg:p-10">
			<div class="pancake-stack my-4 flex flex-col items-center text-gray-700">
				<button
					class="pancake html"
					tabindex="0"
					onmouseenter={() => updateMessage('html')}
					ontouchstart={() => updateMessage('html')}
					onmouseleave={() => updateMessage('default')}
					ontouchend={() => updateMessage('default')}
					onclick={() => navigateToLesson('html')}
				>
					<div class="butter"></div>
					<p class="font-semibold">HTML</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.html}%;"></div>
					</div>
				</button>
				<button
					class="pancake css"
					tabindex="0"
					onmouseenter={() => updateMessage('css')}
					ontouchstart={() => updateMessage('css')}
					onmouseleave={() => updateMessage('default')}
					ontouchend={() => updateMessage('default')}
					onclick={() => navigateToLesson('css')}
				>
					<p class="font-semibold">CSS</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.css}%;"></div>
					</div>
				</button>
				<button
					class="pancake javascript"
					tabindex="0"
					onmouseenter={() => updateMessage('javascript')}
					ontouchstart={() => updateMessage('javascript')}
					onmouseleave={() => updateMessage('default')}
					ontouchend={() => updateMessage('default')}
					onclick={() => navigateToLesson('javascript')}
				>
					<p class="font-semibold">JavaScript</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.javascript}%;"></div>
					</div>
				</button>
				<button
					class="pancake backend"
					tabindex="0"
					onmouseenter={() => updateMessage('backend')}
					ontouchstart={() => updateMessage('backend')}
					onmouseleave={() => updateMessage('default')}
					ontouchend={() => updateMessage('default')}
					onclick={() => navigateToLesson('backend')}
				>
					<p class="font-semibold">Backend</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.backend}%;"></div>
					</div>
				</button>
			</div>
		</section>
	</section>

	<!-- Achievements Section -->
	<section class="mt-8 flex flex-col justify-center gap-8 p-4 md:mt-0 md:flex-row lg:mt-[-2rem]">
		<!-- Badge Display Component -->
		<div class="w-full md:w-1/2 lg:max-w-3xl">
			<BadgeDisplay limit={5} />
		</div>

		<!-- Certificate Display Component - Replace your existing certificates card -->
		<div class="w-full md:w-1/2 lg:max-w-3xl">
			<CertificateDisplay />
		</div>
	</section>
</main>

<style>
	.speech-bubble {
		position: relative;
		background: #fff;
		padding: 15px;
		border-radius: 10px;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
		text-align: center;
		font-weight: bold;
		font-size: 1rem;
		color: rgb(50, 50, 50);
		min-height: 100px;
	}

	.speech-bubble::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid #fff;
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.pancake-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.butter {
		width: 100px;
		height: 25px;
		background: linear-gradient(to bottom, #f1ee90, #f2e144);
		border-radius: 10px;
		position: absolute;
		top: -12px;
		left: calc(50% - 50px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.pancake {
		width: 100%;
		padding: 15px;
		background: linear-gradient(to bottom, #f9c74f, #e68250);
		border-radius: 100px;
		text-align: center;
		position: relative;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.pancake:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
	}

	.progress-bar {
		background: #f1f1f1;
		border-radius: 5px;
		height: 10px;
		width: 100%;
		margin-top: 10px;
		overflow: hidden;
	}

	.progress {
		height: 100%;
		background: #7d5c38;
		transition: width 0.3s ease;
	}

	.badge-container {
		flex: 0 0 auto;
		text-align: center;
	}

	.badge-container img {
		transition: transform 0.2s ease-in-out;
	}

	.badge-container img:hover {
		transform: scale(1.1);
	}

	/* Media Queries for Responsive Design */
	@media (max-width: 640px) {
		.butter {
			width: 80px;
			height: 20px;
			top: -10px;
			left: calc(50% - 40px);
		}

		.pancake {
			padding: 12px;
		}

		.progress-bar {
			height: 8px;
		}
	}

	@media (min-width: 768px) {
		.speech-bubble {
			font-size: 1.1rem;
		}

		.butter {
			width: 110px;
			height: 28px;
			top: -14px;
			left: calc(50% - 55px);
		}
	}

	@media (min-width: 1024px) {
		.butter {
			width: 130px;
			height: 32px;
			top: -15px;
			left: calc(50% - 65px);
		}

		.pancake {
			width: 80%;
			padding: 20px;
		}

		.pancake-stack {
			gap: 0;
		}

		.progress-bar {
			height: 10px;
		}
	}
</style>
