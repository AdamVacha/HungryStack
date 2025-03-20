<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { badgeNotifications, dismissBadgeNotification } from '$lib/badges/badgeNotification';

	let visible = $derived($badgeNotifications.length > 0);
</script>

{#if visible}
	<div class="fixed right-4 top-4 z-50 flex flex-col gap-3">
		{#each $badgeNotifications as badge (badge.id)}
			<div
				class="card variant-filled-primary w-80 p-4 shadow-lg"
				in:fly={{ x: 30, duration: 500, easing: quintOut }}
				out:fade={{ duration: 300 }}
			>
				<div class="flex items-center gap-4">
					<div class="avatar">
						<img src={badge.image} alt={badge.title} class="h-12 w-12 rounded-full object-cover" />
					</div>
					<div class="flex-1 space-y-1">
						<h3 class="font-bold">New Badge: {badge.title}</h3>
						<p class="text-sm">{badge.description}</p>
					</div>
					<button
						class="variant-ghost-surface btn btn-sm"
						onclick={() => dismissBadgeNotification(badge.id)}
						aria-label="Dismiss badge notification"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-x"
							viewBox="0 0 16 16"
						>
							<path
								d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</button>
				</div>
			</div>
		{/each}
	</div>
{/if}
