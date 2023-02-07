<script lang="ts">
	import type { KeepWithUserAndCount } from './types.js'
	import { fade } from 'svelte/transition'
	import axios from 'axios'
	import { page } from '$app/stores'
	import Swal from 'sweetalert2'
	import { invalidateAll } from '$app/navigation'
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
		// @ts-ignore form data
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
				title: 'Keep removed from vault'
			})
			invalidateAll()
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Failed to remove keep from vault'
			})
		}
	}
</script>

{#if keep}
	<div class="relative z-0 mb-4  max-w-md flex-shrink flex-grow cursor-pointer drop-shadow-lg" on:keydown={() => (modalOpen = true)} on:click={() => (modalOpen = true)}>
		<img src={keep.img} class="z-0 w-full rounded-md object-cover text-xl brightness-75" alt={keep.name} />
		<h1 class="absolute top-0 left-0 z-0 p-1 text-5xl text-white shadow-black drop-shadow-2xl">{keep.name}</h1>
		<img src={keep.user.image} class="absolute bottom-0 right-0 z-0 m-1 h-20 w-20 rounded-full border-2 border-white" title={keep.user.name} alt={keep.user.name} />
	</div>

	{#if modalOpen}
		<div class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60 px-10" on:click={() => (modalOpen = false)} on:keydown={() => (modalOpen = false)} transition:fade={{ duration: 100 }}>
			<div on:click|stopPropagation on:keydown|stopPropagation class="flex flex-col  rounded-r-md bg-white md:flex-row">
				<img src={keep.img} class="h-20 w-full  object-cover md:h-full md:w-1/2" alt={keep.name} />
				<div class="flex flex-grow flex-col gap-1 p-2">
					<h2 class="text-center"><i class="mdi mdi-eye" /> {keep.views} | <i class="mdi mdi-share" />{keep._count.vaults}</h2>
					<h1 class="p-1 text-xl">{keep.name}</h1>
					<p class="flex-grow  p-1 ">{keep.description}</p>
					<div class="flex items-center justify-between gap-2">
						<div>
							{#if $page.data.myVaults.length > 0 && $page.data.session && !keep.vaultIds.includes($page.data.vault?.id)}
								<form on:submit|preventDefault={addKeep} class="flex items-center gap-2">
									<select name="vaultId">
										{#each $page.data.myVaults as vault (vault.id)}
											<option value={vault.id}>{vault.name}</option>
										{/each}
									</select>
									<button class="rounded-md bg-fuchsia-800/50 p-1 px-2">Save Keep</button>
								</form>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							{#if $page.route.id?.includes('/vault') && $page.data?.session?.user?.id == $page.data?.vault?.userId}
								<button class="rounded-md bg-red-800/50 p-1 px-2" on:click={() => removeKeep()}>Remove Keep</button>
							{/if}
							{#if $page.data?.session?.user?.id === keep.userId}
								<button class="rounded-md bg-red-800/50 p-1 px-2" on:click={() => deleteKeep(keep.id)}>Delete Keep</button>
							{/if}
						</div>
						<div class="flex items-center gap-2">
							<img src={keep.user.image} alt={keep.user.name} class="w-12 rounded-full" />
							<a href={`/profile/${keep.userId}`} class="m-2 text-blue-400 underline">{keep.user.name}</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}
