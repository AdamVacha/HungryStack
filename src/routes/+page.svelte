<script lang="ts">
</script>

<!-- Landing Page -->

<div class="flex min-h-screen flex-col text-gray-900">
	<!-- Main Content -->
	<main class="flex flex-grow items-center px-16">
		<!-- Left Section: Mascot  -->
		<div class="relative flex w-1/2 items-center justify-center">
			<figure class="relative flex items-center justify-center">
				<div class="img-bg"></div>
				<img
					src="/images/mascot.png"
					alt="Mascot"
					class="relative z-10 h-40 animate-bounce sm:h-80"
				/>
			</figure>
		</div>

		<!-- Right Section: Text-->
		<div class="w-2/5">
			<h1 class="text-4xl font-bold dark:text-white">
				Master Full-Stack Development, One Bite at a Time.
			</h1>
			<p class="mt-4 text-lg dark:text-white">Framework-agnostic and designed for beginners.</p>
			<div class="mt-8 flex space-x-4">
				<button
					type="button"
					class="variant-filled-tertiary btn px-6 py-3 font-semibold text-white dark:variant-filled-primary"
				>
					Get Started
				</button>
				<button
					type="button"
					class="variant-ringed-tertiary btn px-6 py-3 font-semibold dark:variant-ringed-primary dark:text-white"
				>
					I Already Have an Account
				</button>
			</div>
		</div>
	</main>
</div>

<style lang="postcss">
	figure svg,
	.img-bg {
		@apply h-64 w-64 md:h-64 md:w-64;
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
</style>
