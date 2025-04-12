<script lang="ts">
	import Footer from "$lib/components/Footer.svelte";
</script>

<!-- Landing Page -->
<div class="flex min-h-screen flex-col text-gray-900">
	<!-- Main Content -->
	<main class="flex flex-grow flex-col md:flex-row items-center px-4 sm:px-8 md:px-16 py-8 md:py-0">
		<div class="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
			<figure class="relative flex items-center justify-center">
				<div class="img-bg"></div>
				<img
					src="/images/mascot.png"
					alt="Mascot"
					class="relative z-10 h-40 sm:h-60 md:h-80 lg:h-96 animate-bounce"
				/>
			</figure>
		</div>


		<div class="w-full md:w-1/2 text-center md:text-left">
			<h1 class="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white">
				Master Full-Stack Development,
				<span class="block">One Bite at a Time.</span>
			</h1>
			<p class="mt-4 text-base sm:text-lg dark:text-white">Framework-agnostic and designed for beginners.</p>
			<div class="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
				<a
					href="/login"
					class="variant-filled-tertiary btn px-4 sm:px-6 py-2 sm:py-3 font-semibold text-white dark:variant-filled-primary"
				>
					Get Started
				</a>
				<a
					href="/"
					class="variant-ringed-tertiary btn px-4 sm:px-6 py-2 sm:py-3 font-semibold dark:variant-ringed-primary dark:text-white"
				>
					Learn More
				</a>
			</div>
		</div>
	</main>
</div>
<Footer />

<style lang="postcss">
	figure svg,
	.img-bg {
		@apply h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation:
			pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-warning-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
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

	.animate-bounce {
		animation: bounce 2s infinite;
	}

	.badge {
		@apply rounded-md bg-primary-500 px-2 py-1 text-sm text-white;
	}

	.card img {
		@apply rounded-t-lg;
	}
	
	@media (max-width: 640px) {
		.btn {
			@apply w-full;
		}
	}
</style>