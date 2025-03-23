<script lang="ts">
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	const module = $derived(data.module);
	const subject = $derived(data.subject);
</script>

<div class="flex h-full flex-row gap-4 p-4">
	<div class="rounded-lg border border-solid p-4">
		{module.name}
	</div>
	<div class="rounded-lg border border-solid p-4">
		{@render children?.()}
	</div>
</div>
