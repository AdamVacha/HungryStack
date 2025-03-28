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
	class="flex min-h-screen items-center justify-center bg-gradient-to-b from-surface-100 to-tertiary-100 dark:from-surface-700 dark:to-surface-900"
>
	<div class="card w-full max-w-lg p-10 shadow-lg">
		<!-- Welcome and Animation -->
		<header class="card-header mb-6 text-center">
			<h1 class="text-2xl font-bold">Welcome to Hungry Stack</h1>
			<DotLottieSvelte src="/animations/pancakes.lottie" loop={true} autoplay={true} />
			<p>Sign in or sign up to continue learning!</p>
		</header>

		<section class="space-y-4 text-center">
			<!-- Google Authentication - Using the SignIn component -->
			<SignIn provider="google" callbackUrl="/dashboard">
				<div slot="submitButton" class="btn flex bg-red-500 py-3 text-white">
					<span><img src="/images/google.svg" alt="Google" class="mr-3 h-6 w-6" /></span>
					<span>Continue with Google</span>
				</div>
			</SignIn>

			<!-- GitHub Authentication - Using the SignIn component -->
			<SignIn provider="github" callbackUrl="/dashboard">
				<div slot="submitButton" class="btn flex bg-gray-800 py-3 text-white">
					<span><img src="/images/github.svg" alt="GitHub" class="mr-3 h-6 w-6" /></span>
					<span>Continue with GitHub</span>
				</div>
			</SignIn>
		</section>
	</div>
</div>
