<script lang="ts">
	import type { PageData } from './$types'
	import Keep from '$lib/Keep.svelte'
	import Vault from '$lib/Vault.svelte'
	import { enhance } from '$app/forms'

	export let data: PageData

	let modalOpen = false
</script>

<svelte:head>
	<title>Postr Account</title>
</svelte:head>

{#if data?.session?.user && data.myKeeps && data.myVaults}
	<div class="flex flex-col items-center pt-4">
		{#if data?.user?.coverImg}
			<img src={data.user.coverImg} alt={data.user.name} class="h-96" />
			<img src={data.user.image} alt={data.user.image} class="-mt-14 rounded-full" />
		{:else}
			<img src={data?.user?.image} alt={data?.user?.image} />
		{/if}
		<div class="flex items-center gap-3">
			<h1 class="text-center text-4xl">{data?.user?.name}</h1>
			<i class="mdi mdi-dots-horizontal cursor-pointer text-2xl" on:click={() => (modalOpen = true)} />
		</div>
		<h2 class="text-center text-2xl">{data.myVaults.length} vaults | {data.myVaults.length} keeps</h2>
	</div>

	<h1 class="text-center text-5xl">Vaults</h1>
	<div class="columns-2 gap-4 p-3 md:columns-4">
		{#each data.myVaults as vault (vault.id)}
			<Vault {vault} />
		{/each}
	</div>
	<h1 class="text-center text-5xl">Keeps</h1>
	<div class="columns-2 gap-8 p-3 md:columns-4">
		{#each data.myKeeps as keep (keep.id)}
			<Keep {keep} />
		{/each}
	</div>
	{#if modalOpen}
		<div class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60" on:keydown={() => (modalOpen = false)} on:click={() => (modalOpen = false)}>
			<div class=" bg-white p-3" on:keydown|stopPropagation on:click|stopPropagation>
				<form class="flex flex-col gap-2" method="post" use:enhance on:submit={() => (modalOpen = false)}>
					<h1 class="text-2xl">Edit Account</h1>
					<label for="name" class="flex items-center justify-between gap-3">
						Name
						<input type="text" name="name" id="name" value={data.user?.name} />
					</label>
					<label for="image" class="flex items-center justify-between gap-3">
						Profile Picture
						<input type="text" name="image" id="image" value={data.user?.image} />
					</label>
					<label for="coverImg" class="flex items-center justify-between gap-3">
						Cover Image
						<input type="text" name="coverImg" id="coverImg" value={data.user?.coverImg} />
					</label>
					<div class="flex items-center justify-between">
						<button type="button" class="w-2/5 rounded-md bg-red-500 p-1 px-2 text-white" on:click={() => (modalOpen = false)}>Cancel</button>
						<button type="submit" class="w-2/5 rounded-md bg-fuchsia-800/80 p-1 px-2 text-white">Save</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
{:else}
	You must be logged in to view this page
{/if}
