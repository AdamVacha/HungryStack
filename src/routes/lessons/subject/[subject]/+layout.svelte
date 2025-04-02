<script lang="ts">
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<div class="w-full min-h-screen">
	{@render children?.()}
</div>
