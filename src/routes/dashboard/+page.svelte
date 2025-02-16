<script>
	import { page } from '$app/state';

	let username = page?.data?.session?.user?.name ?? 'Guest';
	let progress = {
		html: 25,
		css: 50,
		javascript: 75,
		backend: 20
	};
	let achievements = [
		{ title: 'HTML Basics', description: 'Completed HTML Foundations' },
		{ title: 'CSS Mastery', description: 'Completed CSS Animations' },
		{ title: 'JavaScript Pro', description: 'Built your first async function' }
	];
</script>

<main class="min-h-screen">
	<!-- Main Section -->
	<section
		class="grid grid-cols-1 items-center justify-center justify-items-stretch gap-8 p-10 lg:grid-cols-10"
	>
		<!-- Welcome Message Column (30%) -->
		<section class="lg:col-span-3">
			<div class="items-center  space-x-4 p-10">
				<div>
					<h2 class="text-2xl font-semibold">Welcome, {username}!</h2>
					<p>Keep stacking your pancakes to master full-stack development!</p>
				</div>
				<img src="/images/mascot.png" alt="Mascot" class="relative max-h-80 animate-bounce" />
			</div>
		</section>

		<!-- Pancake Stack Column (70%) -->
		<section class="p-10 lg:col-span-7">
			<div class="pancake-stack my-4 flex flex-col items-center text-gray-700">
				<div class="slice html">
					<div class="butter"></div>
					<p class="font-semibold">HTML</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.html}%;"></div>
					</div>
				</div>
				<div class="slice css">
					<p class="font-semibold">CSS</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.css}%;"></div>
					</div>
				</div>
				<div class="slice js">
					<p class="font-semibold">JavaScript</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.javascript}%;"></div>
					</div>
				</div>
				<div class="slice backend">
					<p class="font-semibold">Backend</p>
					<div class="progress-bar">
						<div class="progress" style="width: {progress.backend}%;"></div>
					</div>
				</div>
			</div>
		</section>
	</section>
	<!-- Achievements Section -->
	<section class="flex justify-center space-x-8 p-6">
		<div class="card w-full max-w-3xl p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Your Badges</h2>
			<ul class="space-y-4">
				{#each achievements as achievement}
					<li class="flex items-center space-x-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
							🏆
						</div>
						<div>
							<p class="font-semibold">{achievement.title}</p>
							<p class="text-sm">{achievement.description}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>

		<div class="card w-full max-w-3xl p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Your Certificates</h2>
			<ul class="space-y-4">
				{#each achievements as achievement}
					<li class="flex items-center space-x-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
							🏆
						</div>
						<div>
							<p class="font-semibold">{achievement.title}</p>
							<p class="text-sm">{achievement.description}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>
</main>

<style>
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

	.slice {
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

	.slice:hover {
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
</style>
