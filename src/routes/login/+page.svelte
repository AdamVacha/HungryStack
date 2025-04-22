<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { SignIn } from '@auth/sveltekit/components';
	import { page } from '$app/state';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-b from-surface-100 to-tertiary-100 px-4 py-6 sm:px-6 sm:py-8 dark:from-surface-700 dark:to-surface-900"
>
	<div
		class="card w-full max-w-xs p-4 shadow-lg sm:max-w-sm sm:p-6 md:max-w-md md:p-8 lg:max-w-lg lg:p-10"
	>
		<!-- Welcome and Animation -->
		<header class="card-header mb-4 text-center sm:mb-6">
			<h1 class="text-xl font-bold sm:text-2xl">Welcome to Hungry Stack</h1>
			<div class="mx-auto w-full max-w-64">
				<DotLottieSvelte src="/animations/pancakes.lottie" loop={true} autoplay={true} />
			</div>
			<p class="text-sm sm:text-base">Sign in or sign up to continue learning!</p>
		</header>

		<section class="space-y-3 text-center sm:space-y-4">
			<!-- Google Authentication - Using the SignIn component -->
			<SignIn provider="google" callbackUrl="/dashboard">
				<div
					slot="submitButton"
					class="btn flex w-full items-center justify-center bg-red-500 py-2 text-sm text-white sm:py-3 sm:text-base"
				>
					<span
						><img
							src="/images/google.svg"
							alt="Google"
							class="mr-2 h-5 w-5 sm:mr-3 sm:h-6 sm:w-6"
						/></span
					>
					<span>Continue with Google</span>
				</div>
			</SignIn>

			<!-- GitHub Authentication - Using the SignIn component -->
			<SignIn provider="github" callbackUrl="/dashboard">
				<div
					slot="submitButton"
					class="btn flex w-full items-center justify-center bg-gray-800 py-2 text-sm text-white sm:py-3 sm:text-base"
				>
					<span
						><img
							src="/images/github.svg"
							alt="GitHub"
							class="mr-2 h-5 w-5 sm:mr-3 sm:h-6 sm:w-6"
						/></span
					>
					<span>Continue with GitHub</span>
				</div>
			</SignIn>
		</section>
	</div>
</div>

<style>
	:global(.dotlottie-container) {
		width: 100% !important;
		height: auto !important;
	}
</style>
