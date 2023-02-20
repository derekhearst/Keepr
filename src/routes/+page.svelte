<script lang="ts">
	import type { PageData } from './$types'
	import Keep from '$lib/Keep.svelte'
	import { navigating } from '$app/stores'
	export let data: PageData
</script>

<svelte:head>
	<title>Keepr</title>
</svelte:head>

{#if data.keeps.length > 0}
	<div class="columns-2 gap-8 p-3 md:columns-4">
		{#each data.keeps as keep (keep.id)}
			<Keep {keep} />
		{/each}
	</div>
{/if}
