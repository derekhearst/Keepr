<script lang="ts">
	import type { PageData } from './$types'
	import Keep from '$lib/Keep.svelte'
	export let data: PageData
</script>

{#if data.keeps.length > 0}
	<div class="columns-2 gap-4 p-3 md:columns-4">
		{#each data.keeps as keep (keep.id)}
			<Keep {keep} />
		{/each}
	</div>
{/if}
