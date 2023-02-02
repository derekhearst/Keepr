<script>
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { page } from '$app/stores'
	import '../app.postcss'
	import { browser } from '$app/environment'
	import axios from 'axios'
	import { myVaults, myKeeps } from '$lib/stores.js'

	let keepModal = false
	let vaultModal = false

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

	async function createVault(e) {
		let res = await axios.post('/api/vaults', {
			name: e.target.name.value,
			description: e.target.description.value,
			img: e.target.img.value,
			isPrivate: e.target.isPrivate.checked
		})
		$myVaults = [...$myVaults, res.data]
	}

	async function createKeep(e) {
		let res = await axios.post('/api/keeps', {
			name: e.target.name.value,
			description: e.target.description.value,
			img: e.target.img.value
		})
		console.log(res.data)
		$page.data.keeps = [...$page.data.keeps, res.data]
	}
</script>

<header class="bg-neutral-200 flex items-center justify-between px-3">
	<div class="flex w-1/4 gap-2">
		<a href="/" class="bg-fuchsia-700/50 p-1 px-2 rounded-md">Home</a>
		<button class="underline-offset-2 text-fuchsia-800 p-1 px-2 underline rounded-md" on:keydown={() => (keepModal = true)} on:click={() => (keepModal = true)}>Create Keep</button>
		<button class="underline-offset-2 text-fuchsia-800 p-1 px-2 underline rounded-md" on:keydown={() => (vaultModal = true)} on:click={() => (vaultModal = true)}> Create Vault</button>
	</div>
	<div class="flex justify-center w-1/2">
		<img src="/Keeprlogo.png" class=" h-20 p-1" alt="logo" />
	</div>
	<div class="flex items-center justify-end w-1/4 gap-2">
		{#if $page.data.session}
			<button class="bg-fuchsia-700/50 border-zinc-900 p-1 px-2 rounded-lg" on:click={() => signOut()}>Log Out</button>
			<img src={$page.data.session.user?.image} alt="avatar" class="w-20 h-20 p-1 rounded-full" />
		{:else}
			<button on:click={() => signIn('auth0')} class="bg-fuchsia-700/50 border-zinc-900 p-1 px-2 rounded-lg">Sign In</button>
		{/if}
	</div>

	{#if keepModal}
		<div class="bg-black/50 fixed top-0 left-0 flex items-center justify-center w-screen h-screen" on:keydown={() => (keepModal = false)} on:click|stopPropagation={() => (keepModal = false)}>
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
		<div class="bg-black/50 fixed top-0 left-0 flex items-center justify-center w-screen h-screen" on:keydown={() => (vaultModal = false)} on:click|stopPropagation={() => (vaultModal = false)}>
			<div class="flex flex-col gap-1 p-4 bg-white rounded-md" on:keydown|stopPropagation on:click|stopPropagation>
				<h1 class="mb-3 text-3xl text-center">Create Vault</h1>
				<form class="flex flex-col gap-3" on:submit|preventDefault={createVault}>
					<label for="Name" class="flex items-center justify-between gap-3">
						Name
						<input type="text" id="Name" required name="Name" placeholder="Vault Name" />
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
						<button class="bg-red-700/50 border-zinc-900 w-2/5 p-1 px-2 rounded-lg" type="button" on:click={() => (keepModal = false)}>Cancel</button>
						<button class="bg-fuchsia-700/50 border-zinc-900 w-2/5 p-1 px-2 rounded-lg" type="submit">Create</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</header>
<slot />
