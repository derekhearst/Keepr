<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import axios from 'axios'
	import Keep from '$lib/Keep.svelte'

	onMount(async () => {
		console.log($page.data.keeps)
	})
</script>

{#if $page.data.keeps.length > 0}
	<div class="flex flex-wrap gap-4 p-3">
		{#each $page.data.keeps as keep (keep.id)}
			<Keep {keep} />
		{/each}
	</div>
{/if}
