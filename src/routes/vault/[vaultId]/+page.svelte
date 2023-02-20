<script lang="ts">
	import Vault from '$lib/Vault.svelte'
	import type { PageData } from './$types.js'
	import { fade } from 'svelte/transition'
	import axios from 'axios'
	import Swal from 'sweetalert2'
	import Keep from '$lib/Keep.svelte'

	export let data: PageData
	let editModal = false

	async function editVault(e: Event) {
		try {
			const formData = {
				// @ts-ignore form data
				name: e.target.name.value,
				// @ts-ignore form data
				img: e.target.img.value,
				// @ts-ignore form data
				isPrivate: e.target.isPrivate.checked,
				// @ts-ignore form data
				description: e.target.description.value
			}
			const res = await axios.put('/api/vaults/' + data?.vault?.id, formData)
			Swal.fire({
				icon: 'success',
				title: 'Vault Updated',
				text: 'Your vault has been updated'
			})
			if (data.vault) {
				data.vault.name = formData.name
				data.vault.img = formData.img
				data.vault.isPrivate = formData.isPrivate
				data.vault.description = formData.description

				let thisVault = data.myVaults.find((v) => v.id == data?.vault?.id)
				if (thisVault) {
					thisVault.name = formData.name
					thisVault.img = formData.img
					thisVault.isPrivate = formData.isPrivate
					thisVault.description = formData.description
				}
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'There was an error updating your vault'
			})
		}
		editModal = false
	}
</script>

<svelte:head>
	<title>Keepr {data.vault?.name}</title>
</svelte:head>

{#if data.vault}
	<div class="flex flex-col items-center p-2">
		<img src={data.vault.img} alt={data.vault.name} class="h-96 rounded-md object-cover md:w-1/2" />
		<img src={data.vault.user.image} alt={data.vault.user.image} class="-mt-16 h-32 w-32 rounded-full object-cover" />
		<div class="flex items-center gap-2">
			<h1 class="text-4xl">{data.vault.name} by {data.vault.user.name}</h1>
			{#if data.vault.isPrivate}
				<i class="mdi mdi-lock text-3xl text-red-600" />
			{/if}
			{#if data.vault.userId == data?.session?.user?.id}
				<i class="mdi mdi-dots-horizontal cursor-pointer text-2xl" title="Edit Vault" on:click={() => (editModal = true)} on:keydown={() => (editModal = true)} />
			{/if}
		</div>

		<div class="columns-2 gap-8 p-2 md:columns-4">
			{#each data.vault.keeps as keep (keep.id)}
				<Keep {keep} />
			{/each}
		</div>
	</div>

	{#if editModal}
		<div class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60" transition:fade={{ duration: 100 }} on:keydown={() => (editModal = false)} on:click={() => (editModal = false)}>
			<div class="flex flex-col gap-2 bg-white p-3" on:click|stopPropagation on:keydown|stopPropagation>
				<h1 class="text-2xl">Edit Vault "{data.vault.name}"</h1>
				<form class="flex flex-col gap-2" on:submit|preventDefault={editVault}>
					<label for="name" class="flex items-center justify-between gap-2">
						Name
						<input type="text" name="name" id="name" value={data.vault.name} />
					</label>
					<label for="img" class="flex items-center justify-between gap-2">
						Image
						<input type="text" name="img" id="img" value={data.vault.img} />
					</label>
					<label for="isPrivate" class="flex items-center gap-2">
						Private
						<input type="checkbox" name="isPrivate" id="isPrivate" class="" checked={data.vault.isPrivate} />
					</label>
					<label for="description" class="flex items-center gap-2">
						Description
						<textarea name="description" id="description" class="" value={data.vault.description} />
					</label>

					<div class="flex items-center justify-between">
						<button type="button" class="rounded-md bg-red-400 p-1 px-2" on:click={() => (editModal = false)}>Cancel</button>
						<button type="submit" class="rounded-md bg-fuchsia-800/70 p-1 px-2">Save</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
{:else}
	<div class="flex flex-col items-center p-2">
		<h1 class="text-4xl">Vault Not Found</h1>
	</div>
{/if}
