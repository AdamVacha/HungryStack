<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let username = page?.data?.session?.user?.name ?? 'Guest';
	//TODO: Update progress with $state rune / db
	let progress = {
		html: 25,
		css: 50,
		javascript: 75,
		backend: 20
	};
	let certificates = [
		{ title: 'HTML Basics', description: 'Completed HTML Foundations' },
		{ title: 'CSS Mastery', description: 'Completed CSS Animations' },
		{ title: 'JavaScript Pro', description: 'Built your first async function' }
	];
	let badges = [
		{
			title: 'First Lesson Badge',
			description: 'Completed your first lesson!',
			image: '/badges/first-stack-badge.png'
		},
		{
			title: 'Syntax Chef',
			description: 'Wrote 10 correct code snippets!',
			image: '/badges/syntax-chef-badge.png'
		},
		{
			title: 'Daily Flipper',
			description: 'Login for 5 consecutive days',
			image: '/badges/daily-flipper-badge.png'
		},
		{
			title: 'Syntax Chef',
			description: 'Wrote 10 correct code snippets!',
			image: '/badges/syntax-chef-badge.png'
		},
		{
			title: 'Syntax Chef',
			description: 'Wrote 10 correct code snippets!',
			image: '/badges/syntax-chef-badge.png'
		}
	];
	let messages = {
		default: `Welcome, ${username}!<br> Keep stacking your pancakes!`,
		html: 'HTML is the backbone of web pages. It structures your content!',
		css: 'CSS makes the web beautiful! Learn how to style your pages.',
		js: 'JavaScript brings web pages to life! Make them interactive.',
		backend: 'Backend development handles databases and server logic.'
	};

	let speechBubbleText = messages.default;

	// Function to update message when hovering over a pancake
	/**
	 * @param {keyof typeof messages} category
	 */
	function updateMessage(category) {
		speechBubbleText = messages[category] || messages.default;
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
				<div
					class="pancake html"
					role="button"
					tabindex="0"
					on:mouseenter={() => updateMessage('html')}
					on:mouseleave={() => updateMessage('default')}
				>
					<div class="butter"></div>
					<p class="font-semibold">HTML</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.html}%;"></div>
					</div>
				</div>
				<div
					class="pancake css"
					role="button"
					tabindex="0"
					on:mouseenter={() => updateMessage('css')}
					on:mouseleave={() => updateMessage('default')}
				>
					<p class="font-semibold">CSS</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.css}%;"></div>
					</div>
				</div>
				<div
					class="pancake js"
					role="button"
					tabindex="0"
					on:mouseenter={() => updateMessage('js')}
					on:mouseleave={() => updateMessage('default')}
				>
					<p class="font-semibold">JavaScript</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.javascript}%;"></div>
					</div>
				</div>
				<div
					class="pancake backend"
					role="button"
					tabindex="0"
					on:mouseenter={() => updateMessage('backend')}
					on:mouseleave={() => updateMessage('default')}
				>
					<p class="font-semibold">Backend</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.backend}%;"></div>
					</div>
				</div>
			</div>
		</section>
	</section>
	<!-- Achievements Section -->

	<section class="mt-[-7rem] flex justify-center space-x-8 p-6">
		<div class="card w-full max-w-3xl p-6 shadow">
			<h2
				class="mb-2 bg-gradient-to-br from-red-500 to-yellow-500 box-decoration-clone bg-clip-text text-center text-2xl font-semibold text-transparent"
			>
				Your Badges
			</h2>
			<div class="flex snap-x snap-mandatory scroll-px-4 overflow-x-auto scroll-smooth p-4">
				{#each badges as badge}
					<div class="badge-container flex flex-col items-center">
						<img src={badge.image} alt={badge.title} class="h-40" />
					</div>
				{/each}
			</div>
		</div>

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
