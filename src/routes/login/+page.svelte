<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/state';

	console.log(page.data.session);
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-b from-surface-100 to-tertiary-100 dark:from-surface-700 dark:to-surface-900"
>
	{#if page.data.session}
		<div class="card w-full max-w-lg space-y-4 p-10 text-center shadow-lg">
			<h1>Welcome</h1>

			{#if page.data.session.user?.image}
				<img src={page.data.session.user.image} class="mx-auto h-12 w-12" alt="User avatar" />
			{/if}
			<p>Signed in as {page.data.session.user?.name}</p>
			<button
				on:click={() => signOut()}
				type="button"
				class="btn flex w-full items-center justify-center bg-gray-800 py-3 text-white"
			>
				<span>Sign out</span>
			</button>
		</div>
	{:else}
		<div class="card w-full max-w-lg p-10 shadow-lg">
			<!-- Logo and Title -->
			<header class="card-header mb-6 text-center">
				<h1 class="text-2xl font-bold">Welcome to Hungry Stack</h1>
				<img src="/images/mascot.png" alt="Hungry Stack Mascot" class="mx-auto h-36" />

				<p>Sign in or sign up to continue learning!</p>
			</header>

			<section class="space-y-4">
				<!-- Google Authentication -->
				<button
					on:click={() => signIn('google')}
					type="button"
					class="btn flex w-full items-center justify-center bg-red-500 py-3 text-white"
				>
					<span><img src="/images/google.svg" alt="Google" class="mr-3 h-6 w-6" /></span>
					<span>Continue with Google</span>
				</button>

				<!-- GitHub Authentication -->
				<button
					on:click={() => signIn('github')}
					type="button"
					class="btn flex w-full items-center justify-center bg-gray-800 py-3 text-white"
				>
					<span><img src="/images/github.svg" alt="GitHub" class="mr-3 h-6 w-6" /></span>
					<span>Continue with GitHub</span>
				</button>
			</section>
		</div>
	{/if}
</div>
