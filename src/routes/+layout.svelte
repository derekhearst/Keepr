<script lang="ts">
	import '../app.postcss'
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { browser } from '$app/environment'
	import { navigating } from '$app/stores'
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

<header class="relative z-10 flex flex-wrap items-center justify-between bg-neutral-200 px-3 drop-shadow-md">
	<div class="flex w-1/4 flex-wrap items-center justify-center gap-2 p-2 text-xl md:justify-start md:p-0">
		<a href="/" class="rounded-md bg-fuchsia-700/50 p-1 px-3">Home</a>
		<button class="rounded-md p-1 px-2 text-fuchsia-800 underline underline-offset-2" on:keydown={() => (keepModal = true)} on:click={() => (keepModal = true)}>Create Keep</button>
		<button class="rounded-md p-1 px-2 text-fuchsia-800 underline underline-offset-2" on:keydown={() => (vaultModal = true)} on:click={() => (vaultModal = true)}> Create Vault</button>
	</div>
	<div class="flex w-1/2 justify-center">
		<a href="/">
			<img src="/Keeprlogo.png" class=" h-20 p-1" alt="logo" />
		</a>
	</div>
	<div class="flex w-1/4 flex-wrap items-center justify-end gap-2">
		{#if data?.session?.user}
			<button class="rounded-lg border-zinc-900 bg-fuchsia-700/50 p-1 px-2" on:click={() => signOut()}>Log Out</button>
			<a href="/account">
				<img src={data.session.user.image} alt="avatar" class="h-20 w-20 rounded-full p-1" />
			</a>
		{:else}
			<button on:click={() => signIn('auth0')} class="rounded-lg border-zinc-900 bg-fuchsia-700/50 p-1 px-2">Sign In</button>
		{/if}
	</div>

	{#if keepModal}
		<div class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50" on:keydown={() => (keepModal = false)} on:click|stopPropagation={() => (keepModal = false)} transition:fade={{ duration: 100 }}>
			<div class="flex flex-col gap-1 rounded-md bg-white p-4" on:keydown|stopPropagation on:click|stopPropagation>
				<h1 class="mb-3 text-center text-3xl">Create Keep</h1>
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
						<button class="w-2/5 rounded-lg border-zinc-900 bg-red-700/50 p-1 px-2" type="button" on:click={() => (keepModal = false)}>Cancel</button>
						<button class="w-2/5 rounded-lg border-zinc-900 bg-fuchsia-700/50 p-1 px-2" type="submit">Create</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
	{#if vaultModal}
		<div class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50" on:keydown={() => (vaultModal = false)} on:click|stopPropagation={() => (vaultModal = false)} transition:fade={{ duration: 100 }}>
			<div class="z-50 flex flex-col gap-1 rounded-md bg-white p-4" on:keydown|stopPropagation on:click|stopPropagation>
				<h1 class="mb-3 text-center text-3xl">Create Vault</h1>
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
						<button class="w-2/5 rounded-lg border-zinc-900 bg-red-700/50 p-1 px-2" type="button" on:click={() => (vaultModal = false)}>Cancel</button>
						<button class="w-2/5 rounded-lg border-zinc-900 bg-fuchsia-700/50 p-1 px-2" type="submit">Create</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</header>

{#if $navigating}
	<div class="origin-center animate-spin text-center">
		<i class="mdi mdi-loading text-8xl  text-black" />
	</div>
{:else}
	<slot>
		<h1 class="text-center text-4xl">Loading data, please wait...</h1>
	</slot>
{/if}
