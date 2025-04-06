<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import BadgeDisplay from '$lib/components/BadgeDisplay.svelte';

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

	let certificates = [
		{ title: 'HTML Basics', description: 'Completed HTML Foundations' },
		{ title: 'CSS Mastery', description: 'Completed CSS Animations' },
		{ title: 'JavaScript Pro', description: 'Built your first async function' }
	];

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

	/**
	 * @param {string} subject
	 */
	function navigateToLesson(subject: string) {
		console.log(`Navigating to ${subject}`, nextLessonLinks[subject]);
		console.log(`Clicking ${subject} pancake`);
		console.log(`Data for ${subject}:`, progressData[subject]);
		console.log(`Next lesson link for ${subject}:`, nextLessonLinks[subject]);

		// Get the subjectId from mapping
		const subjectMap: Record<string, number> = {
			html: 1,
			css: 2,
			javascript: 3,
			backend: 4
		};

		const subjectId = subjectMap[subject] || 1;

		if (nextLessonLinks[subject]) {
			goto(nextLessonLinks[subject] as string);
		} else {
			// Get the first module and lesson for this subject
			goto(`/lessons/subject/${subjectId}`);
		}
	}
</script>

<main class="min-h-screen">
	<section
		class="mt-[-4rem] grid max-h-[900px] grid-cols-1 items-center justify-center justify-items-stretch gap-8 p-10 lg:grid-cols-10"
	>
		<!-- Welcome Message Column (30%) -->
		<section class="lg:col-span-3">
			<div class="items-center space-x-4 p-10">
				<!-- Speech Bubble -->
				<div class="speech-bubble">
					<p>
						{@html speechBubbleText}
					</p>
				</div>
				<img src="/images/mascot.png" alt="Mascot" class="relative h-80 animate-bounce" />
			</div>
		</section>

		<!-- Pancake Stack Column (70%) -->
		<section class="p-10 lg:col-span-7">
			<div class="pancake-stack my-4 flex flex-col items-center text-gray-700">
				<button
					class="pancake html"
					tabindex="0"
					onmouseenter={() => updateMessage('html')}
					onmouseleave={() => updateMessage('default')}
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
					onmouseleave={() => updateMessage('default')}
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
					onmouseleave={() => updateMessage('default')}
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
					onmouseleave={() => updateMessage('default')}
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

	<section class="mt-[-7rem] flex justify-center space-x-8 p-6">
		<!-- Badge Display Component -->
		<BadgeDisplay limit={5} />

		<div class="card w-full max-w-3xl p-6 shadow">
			<h2
				class="mb-2 bg-gradient-to-br from-red-500 to-yellow-500 box-decoration-clone bg-clip-text text-center text-2xl font-semibold text-transparent"
			>
				Your Certificates
			</h2>
			<ul class="space-y-4">
				{#each certificates as certificate}
					<li class="flex items-center space-x-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
							🏆
						</div>
						<div>
							<p class="font-semibold">{certificate.title}</p>
							<p class="text-sm">{certificate.description}</p>
						</div>
					</li>
				{/each}
			</ul>
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
		max-width: 250px;
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
	}

	.butter {
		width: 130px;
		height: 32px;
		background: linear-gradient(to bottom, #f1ee90, #f2e144);
		border-radius: 10px;
		position: absolute;
		top: -15px;
		left: calc(50% - 65px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.pancake {
		width: 80%;
		padding: 20px;
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
</style>
