<script lang="ts">
	import type { KeepWithUserAndCount, VaultWithKeeps } from './types.js'
	import { fade } from 'svelte/transition'
	import axios from 'axios'
	import { page } from '$app/stores'
	import Swal from 'sweetalert2'
	import { invalidate, invalidateAll } from '$app/navigation'
	export let keep: KeepWithUserAndCount
	let modalOpen = false

	$: {
		if (modalOpen) {
			axios.get(`/api/keeps/${keep.id}`)
			if (keep.views) {
				keep.views++
			}
		}
	}

	async function addKeep(e: Event) {
		// @ts-ignore
		let vaultId = e.target.vaultId.value
		try {
			const res = await axios.post('/api/vaultkeeps', { keepId: keep.id, vaultId: vaultId })
			Swal.fire({
				icon: 'success',
				title: 'Keep saved to vault'
			})
			invalidateAll()
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Failed to save keep'
			})
		}

		modalOpen = false
	}

	async function deleteKeep(keepId: string) {
		try {
			const res = await axios.delete(`/api/keeps/${keepId}`)
			Swal.fire({
				icon: 'success',
				title: 'Keep deleted'
			})
			invalidateAll()
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Failed to delete keep'
			})
		}
	}

	async function removeKeep() {
		try {
			const res = await axios.delete(`/api/vaultkeeps/${$page.params.vaultId}`, { data: { keepId: keep.id } })
			Swal.fire({
				icon: 'success',
				title: 'Keep deleted from vault'
			})
			invalidateAll()
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Failed to delete keep from vault'
			})
		}
	}
</script>

{#if keep}
	<div class="relative drop-shadow-lg mb-4  z-0 flex-grow cursor-pointer flex-shrink max-w-md" on:keydown={() => (modalOpen = true)} on:click={() => (modalOpen = true)}>
		<img src={keep.img} class="object-cover w-full z-0 brightness-75 text-xl rounded-md" alt={keep.name} />
		<h1 class="absolute top-0 left-0 z-0 p-1 text-5xl drop-shadow-2xl shadow-black text-white">{keep.name}</h1>
		<img src={keep.user.image} class="absolute bottom-0 z-0 right-0 w-20 h-20 border-2 border-white m-1 rounded-full" title={keep.user.name} alt={keep.user.name} />
	</div>

	{#if modalOpen}
		<div class="bg-black/60 fixed top-0 left-0 z-50 flex items-center justify-center px-10 w-screen h-screen" on:click={() => (modalOpen = false)} on:keydown={() => (modalOpen = false)} transition:fade={{ duration: 100 }}>
			<div on:click|stopPropagation on:keydown|stopPropagation class="flex bg-white  rounded-r-md flex-col md:flex-row">
				<img src={keep.img} class="object-cover md:w-1/2  w-full h-20 md:h-full" alt={keep.name} />
				<div class="flex flex-col flex-grow gap-1 p-2">
					<h2 class="text-center"><i class="mdi mdi-eye" /> {keep.views} | <i class="mdi mdi-share" />{keep._count.vaults}</h2>
					<h1 class="p-1 text-xl">{keep.name}</h1>
					<p class="p-1  flex-grow ">{keep.description}</p>
					<div class="flex items-center justify-between gap-2">
						<div>
							{#if $page.data.myVaults.length > 0 && $page.data.session}
								<form on:submit|preventDefault={addKeep} class="flex items-center gap-2">
									<select name="vaultId">
										{#each $page.data.myVaults as vault (vault.id)}
											<option value={vault.id}>{vault.name}</option>
										{/each}
									</select>
									<button class="bg-fuchsia-800/50 p-1 px-2 rounded-md">Save Keep</button>
								</form>
							{/if}
						</div>
						<div class="flex gap-2 items-center">
							{#if $page.route.id?.includes('/vault') && $page.data?.session?.user?.id == keep.userId}
								<button class="bg-red-800/50 p-1 px-2 rounded-md" on:click={() => removeKeep()}>Remove Keep</button>
							{/if}
							{#if $page.data?.session?.user?.id === keep.userId}
								<button class="bg-red-800/50 p-1 px-2 rounded-md" on:click={() => deleteKeep(keep.id)}>Delete Keep</button>
							{/if}
						</div>
						<div class="flex gap-2 items-center">
							<img src={keep.user.image} alt={keep.user.name} class="w-12 rounded-full" />
							<a href={`/profile/${keep.userId}`} class="m-2 text-blue-400 underline">{keep.user.name}</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
