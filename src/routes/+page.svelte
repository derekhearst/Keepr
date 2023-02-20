<script lang="ts">
	import type { PageData } from './$types'
	import Keep from '$lib/Keep.svelte'
	import { navigating } from '$app/stores'
	export let data: PageData

</script>

<svelte:head>
	<title>Keepr</title>
</svelte:head>

{#await data.defer.keeps}
	<div class="origin-center animate-spin text-center">
		<i class="mdi mdi-loading text-8xl  text-black" />
	</div>
{:then keeps}
	<div class="columns-2 gap-8 p-3 md:columns-4">
		{#each keeps as keep (keep.id)}
			<Keep {keep} />
		{/each}
	</div>
{/await}
