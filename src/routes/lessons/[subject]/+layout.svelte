<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	const subject = $derived(data.subject);
</script>

<div class="flex gap-8">
	<div>Layout: {subject}</div>
	{@render children()}
</div>
