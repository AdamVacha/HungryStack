<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { SignIn } from '@auth/sveltekit/components';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';

	console.log(page.data.session);

	if (page.data.session) {
		goto('/dashboard');
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-b from-surface-100 to-tertiary-100 dark:from-surface-700 dark:to-surface-900 px-4 py-6 sm:px-6 sm:py-8"
>
	<div class="card w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg">
		<!-- Welcome and Animation -->
		<header class="card-header mb-4 sm:mb-6 text-center">
			<h1 class="text-xl sm:text-2xl font-bold">Welcome to Hungry Stack</h1>
			<div class="w-full max-w-64 mx-auto">
				<DotLottieSvelte src="/animations/pancakes.lottie" loop={true} autoplay={true} />
			</div>
			<p class="text-sm sm:text-base">Sign in or sign up to continue learning!</p>
		</header>

		<section class="space-y-3 sm:space-y-4 text-center">
			<!-- Google Authentication - Using the SignIn component -->
			<SignIn provider="google" callbackUrl="/dashboard">
				<div slot="submitButton" class="btn flex justify-center items-center w-full bg-red-500 py-2 sm:py-3 text-white text-sm sm:text-base">
					<span><img src="/images/google.svg" alt="Google" class="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" /></span>
					<span>Continue with Google</span>
				</div>
			</SignIn>

			<!-- GitHub Authentication - Using the SignIn component -->
			<SignIn provider="github" callbackUrl="/dashboard">
				<div slot="submitButton" class="btn flex justify-center items-center w-full bg-gray-800 py-2 sm:py-3 text-white text-sm sm:text-base">
					<span><img src="/images/github.svg" alt="GitHub" class="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" /></span>
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