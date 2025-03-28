<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { earnedBadges, badgeProgress } from '$lib/badges/badgeStore';
	import { goto } from '$app/navigation';

	const { limit = 5 } = $props();

	let displayBadges = $derived($earnedBadges.slice(0, limit));

	function navigateToBadgesPage() {
		goto('/badges');
	}
</script>

<div class="card w-full p-4">
	<!-- Header with progress indicator -->
	<header class="mb-4 flex items-center justify-between">
		<h2
			class="h2 bg-gradient-to-br from-orange-500 to-amber-500 box-decoration-clone bg-clip-text text-transparent"
		>
			Your Badges
		</h2>
		<div class="variant-filled-primary badge">
			{$badgeProgress.percentage}% complete
		</div>
	</header>

	<!-- Badge display area -->
	{#if displayBadges.length === 0}
		<div class="flex flex-col items-center justify-center p-8 text-center">
			<div class="mb-4 h-24 w-24 opacity-40">
				<img src="/badges/locked-badge.png" alt="No badges yet" class="h-full w-full" />
			</div>
			<h3 class="h3 mb-2">No Badges Yet</h3>
			<p>Complete modules to start collecting badges!</p>
		</div>
	{:else}
		<!-- Badge grid -->
		<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
			{#each displayBadges as badge, i (badge.id)}
				<div
					class="flex flex-col items-center text-center"
					in:fly={{
						y: 20,
						delay: i * 100,
						duration: 400,
						easing: quintOut
					}}
				>
					<div class="avatar mb-2 h-32 p-1">
						<img src={badge.image} alt={badge.title} class="h-full w-full object-cover" />
					</div>
					<h3 class="line-clamp-1 text-sm font-bold">{badge.title}</h3>
					<p class="line-clamp-2 text-xs">{badge.description}</p>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Button to view all badges -->
	<footer class="mt-4 flex justify-center">
		<button class="variant-filled-primary btn" onclick={navigateToBadgesPage}>
			View All Badges
		</button>
	</footer>
</div>
