<script lang="ts">
	import axios from 'axios'
	import Keep from '$lib/Keep.svelte'
	import Vault from '$lib/Vault.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>Keepr {data.profile?.name}</title>
</svelte:head>

{#if data.profile}
	<div class="flex flex-col items-center pt-4">
		{#if data.profile.coverImg}
			<img src={data.profile.coverImg} alt={data.profile.name} />
			<img src={data.profile.image} alt={data.profile.image} class="-mt-16" />
		{:else}
			<img src={data.profile.image} alt={data.profile.image} />
		{/if}
		<h1 class="text-center text-4xl">{data.profile.name}</h1>
		<h2 class="text-center text-2xl">{data.profile.vaults.length} vaults | {data.profile.keeps.length} keeps</h2>
	</div>

	{#if data.profile.vaults.length > 0}
		<h1 class="p-3 text-4xl">Vaults</h1>
	{/if}

	{#if data.profile.vaults.length > 0}
		<div class="flex flex-wrap gap-4 p-3">
			{#each data.profile?.vaults as vault (vault.id)}
				<Vault {vault} />
			{/each}
		</div>
	{/if}

	{#if data.profile.keeps.length > 0}
		<h1 class="p-3 text-4xl">Keeps</h1>
	{/if}

	{#if data.profile.keeps.length > 0}
		<div class="columns-2 gap-4 p-3 md:columns-4">
			{#each data.profile.keeps as keep (keep.id)}
				<Keep {keep} />
			{/each}
		</div>
	{/if}
{:else}
	<h1 class="text-center text-4xl">No user found!</h1>
{/if}
