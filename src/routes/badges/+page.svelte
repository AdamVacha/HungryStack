<script lang="ts">
	import { badgesByCategory, earnedBadges, badgeProgress } from '$lib/badges/badgeStore';
	import { badgeCategories, allBadges } from '$lib/badges/badgeSystem';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	// Define types
	type Badge = {
		id: string;
		title: string;
		description: string;
		image: string;
		dateEarned?: Date | null;
	};
	type CategoryInfo = { name: string; description: string };

	let selectedCategory = $state('all');

	function getFilteredBadges(): Badge[] {
		return selectedCategory === 'all' ? $earnedBadges : $badgesByCategory[selectedCategory] || [];
	}

	function getUnearnedBadges(): Badge[] {
		const earnedIds = new Set($earnedBadges.map((b) => b.id));
		const categoryBadges =
			selectedCategory === 'all'
				? allBadges
				: allBadges.filter((b) => b.category === selectedCategory);
		return categoryBadges.filter((b) => !earnedIds.has(b.id));
	}

	function getCategoryInfo(): CategoryInfo {
		if (selectedCategory === 'all') {
			return {
				name: 'All Badges',
				description: 'All available badges in Hungry Stack'
			};
		}

		const category = badgeCategories.find((c) => c.id === selectedCategory);
		return {
			name: category?.name || 'Badges',
			description: category?.description || ''
		};
	}

	let filteredBadges = $derived(getFilteredBadges());
	let unearnedBadges = $derived(getUnearnedBadges());
	let categoryInfo = $derived(getCategoryInfo());
</script>

<div class="container mx-auto px-8 py-8">
	<div class="rounded-container-lg card bg-surface-100 p-6 shadow">
		<!-- Page header with progress -->
		<header class="mb-6 border-b border-surface-300 pb-4">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<h1 class="h1">Your Badge Collection</h1>

				<div class="flex items-center gap-4">
					<div class="text-center">
						<div class="inline-block">
							<ProgressRadial
								value={$badgeProgress}
								width="w-16"
								meter="stroke-primary-500"
								track="stroke-primary-200"
							>
								<span class="text-lg font-bold">{$badgeProgress}%</span>
							</ProgressRadial>
						</div>
						<p class="text-sm">
							{$earnedBadges.length} of {allBadges.length} badges earned
						</p>
					</div>
				</div>
			</div>
		</header>

		<!-- Category filter tabs -->
		<div class="mb-6">
			<div class="flex flex-wrap gap-2">
				<button
					class="btn {selectedCategory === 'all'
						? 'variant-filled-primary'
						: 'variant-ghost-surface'}"
					onclick={() => (selectedCategory = 'all')}
				>
					All Badges
				</button>

				{#each badgeCategories as category}
					<button
						class="btn {selectedCategory === category.id
							? 'variant-filled-primary'
							: 'variant-ghost-surface'}"
						onclick={() => (selectedCategory = category.id)}
					>
						{category.name}
					</button>
				{/each}
			</div>
		</div>

		<!-- Badge display -->
		<div class="card p-6">
			<h2 class="h2 mb-4">{categoryInfo.name}</h2>
			<p class="mb-6">{categoryInfo.description}</p>

			<!-- Earned badges section -->
			{#if filteredBadges.length > 0}
				<h3 class="h3 mb-4">Earned Badges</h3>
				<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each filteredBadges as badge (badge.id)}
						<div
							class="card flex flex-col items-center p-4 text-center transition-all hover:variant-soft-primary"
						>
							<img src={badge.image} alt={badge.title} class="mb-2 h-32 object-contain" />
							<h4 class="h4">{badge.title}</h4>
							<p class="text-sm">{badge.description}</p>
							<p class="mt-2 text-xs text-surface-500">
								Earned: {badge.dateEarned?.toLocaleDateString()}
							</p>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Locked badges section -->
			{#if unearnedBadges.length > 0}
				<h3 class="h3 mb-4">Badges to Unlock</h3>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each unearnedBadges as badge (badge.id)}
						<div
							class="card flex flex-col items-center p-4 text-center opacity-60 transition-all hover:opacity-80"
						>
							<div class="relative">
								<img
									src="/badges/locked-badge.png"
									alt="Locked badge"
									class="mb-2 h-24 w-24 object-contain"
								/>
							</div>
							<h4 class="h4">{badge.title}</h4>
							<p class="text-sm">{badge.description}</p>
							<p class="mt-2 text-xs text-surface-500">Not yet earned</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
