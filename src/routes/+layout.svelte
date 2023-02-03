<script lang="ts">
	import '../app.postcss'
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { browser } from '$app/environment'
	import { fade } from 'svelte/transition'
	import axios from 'axios'
	import Swal from 'sweetalert2'
	import type { PageData } from './$types'
	import { invalidateAll } from '$app/navigation'
	let keepModal = false
	let vaultModal = false
	export let data: PageData

	$: {
		if (browser) {
			let body = document.querySelector('body')
			if (body) {
				if (keepModal || vaultModal) {
					body.classList.add('overflow-hidden')
				} else {
					body.classList.remove('overflow-hidden')
				}
			}
		}
	}

	async function createVault(e: Event) {
		try {
			let res = await axios.post('/api/vaults', {
				// @ts-ignore form data
				name: e.target.name.value,
				// @ts-ignore form data
				description: e.target.description.value,
				// @ts-ignore form data
				img: e.target.img.value,
				// @ts-ignore form data
				isPrivate: e.target.isPrivate.checked
			})
			data.myVaults = [...data.myVaults, res.data]
			Swal.fire({
				icon: 'success',
				title: 'Vault created'
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Failed to create vault'
			})
		}
		vaultModal = false
		await invalidateAll()
	}

	async function createKeep(e: Event) {
		try {
			let res = await axios.post('/api/keeps', {
				// @ts-ignore form data
				name: e.target.name.value,
				// @ts-ignore form data
				description: e.target.description.value,
				// @ts-ignore form data
				img: e.target.img.value
			})
			await invalidateAll()
			Swal.fire({
				icon: 'success',
				title: 'Keep created'
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Failed to create keep'
			})
		}
		keepModal = false
	}
</script>

<header class="bg-neutral-200 drop-shadow-md relative	z-10 flex items-center justify-between px-3 flex-wrap">
	<div class="flex w-1/4 gap-2 flex-wrap items-center text-xl  justify-center md:justify-start p-2 md:p-0">
		<a href="/" class="bg-fuchsia-700/50 p-1 px-3 rounded-md">Home</a>
		<button class="underline-offset-2 text-fuchsia-800 p-1 px-2 underline rounded-md" on:keydown={() => (keepModal = true)} on:click={() => (keepModal = true)}>Create Keep</button>
		<button class="underline-offset-2 text-fuchsia-800 p-1 px-2 underline rounded-md" on:keydown={() => (vaultModal = true)} on:click={() => (vaultModal = true)}> Create Vault</button>
	</div>
	<div class="flex justify-center w-1/2">
		<a href="/">
			<img src="/Keeprlogo.png" class=" h-20 p-1" alt="logo" />
		</a>
	</div>
	<div class="flex items-center justify-end w-1/4 gap-2 flex-wrap">
		{#if data?.session?.user}
			<button class="bg-fuchsia-700/50 border-zinc-900 p-1 px-2 rounded-lg" on:click={() => signOut()}>Log Out</button>
			<a href="/account">
				<img src={data.session.user.image} alt="avatar" class="w-20 h-20 p-1 rounded-full" />
			</a>
		{:else}
			<button on:click={() => signIn('auth0')} class="bg-fuchsia-700/50 border-zinc-900 p-1 px-2 rounded-lg">Sign In</button>
		{/if}
	</div>

	{#if keepModal}
		<div class="bg-black/50 fixed  z-50 top-0 left-0 flex items-center justify-center w-screen h-screen" on:keydown={() => (keepModal = false)} on:click|stopPropagation={() => (keepModal = false)} transition:fade={{ duration: 100 }}>
			<div class="flex flex-col gap-1 p-4 bg-white rounded-md" on:keydown|stopPropagation on:click|stopPropagation>
				<h1 class="mb-3 text-3xl text-center">Create Keep</h1>
				<form class="flex flex-col gap-3" on:submit|preventDefault={createKeep}>
					<label for="name" class="flex items-center justify-between gap-3">
						Name
						<input type="text" id="name" required name="name" placeholder="Keep Name" />
					</label>
					<label for="description" class="flex items-center justify-between gap-3">
						Description
						<input type="text" required id="description" name="description" placeholder="Keep Description" />
					</label>
					<label for="img" class="flex items-center justify-between gap-3">
						Image
						<input type="url" id="img" required name="img" placeholder="Keep Image" />
					</label>
					<div class="flex items-center justify-between">
						<button class="bg-red-700/50 border-zinc-900 w-2/5 p-1 px-2 rounded-lg" type="button" on:click={() => (keepModal = false)}>Cancel</button>
						<button class="bg-fuchsia-700/50 border-zinc-900 w-2/5 p-1 px-2 rounded-lg" type="submit">Create</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
	{#if vaultModal}
		<div class="bg-black/50 fixed z-50 top-0 left-0 flex items-center justify-center w-screen h-screen" on:keydown={() => (vaultModal = false)} on:click|stopPropagation={() => (vaultModal = false)} transition:fade={{ duration: 100 }}>
			<div class="flex flex-col gap-1 z-50 p-4 bg-white rounded-md" on:keydown|stopPropagation on:click|stopPropagation>
				<h1 class="mb-3 text-3xl text-center">Create Vault</h1>
				<form class="flex flex-col gap-3" on:submit|preventDefault={createVault}>
					<label for="name" class="flex items-center justify-between gap-3">
						Name
						<input type="text" id="name" required name="name" placeholder="Vault Name" />
					</label>
					<label for="description" class="flex items-center justify-between gap-3">
						Description
						<input type="text" id="description" required name="description" placeholder="Vault Description" />
					</label>
					<label for="img" class="flex items-center justify-between gap-3">
						Image
						<input type="url" id="img" name="img" required placeholder="Vault Image" />
					</label>
					<label for="isPrivate" class="flex items-center gap-3">
						Private
						<input type="checkbox" class="ml-8" id="isPrivate" name="isPrivate" />
					</label>
					<div class="flex items-center justify-between">
						<button class="bg-red-700/50 border-zinc-900 w-2/5 p-1 px-2 rounded-lg" type="button" on:click={() => (vaultModal = false)}>Cancel</button>
						<button class="bg-fuchsia-700/50 border-zinc-900 w-2/5 p-1 px-2 rounded-lg" type="submit">Create</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</header>

<slot />
