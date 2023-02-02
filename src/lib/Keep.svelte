<script lang="ts">
	import { myVaults } from '$lib/stores.js'
	import axios from 'axios'
	export let keep: {
		id: string
		name: string
		description: string
		img: string
		views: number
		_count: {
			vaults: number
		}
		userId: string
		user: {
			name: string
			image: string
		}
	}
	let modalOpen = false

	$: {
		if (modalOpen) {
			axios.get(`/api/keeps/${keep.id}`)
		}
	}
</script>

{#if keep}
	<div class="relative flex-grow flex-shrink max-w-md" on:keydown={() => (modalOpen = true)} on:click={() => (modalOpen = true)}>
		<img src={keep.img} class="object-cover w-full text-xl rounded-md" alt={keep.name} />
		<h1 class="absolute top-0 left-0 z-10 p-1 text-xl text-white">{keep.name}</h1>
		<img src={keep.user.image} class="bottom-1 aboslute right-0 w-20 h-20 p-1 rounded-full" title={keep.user.name} alt={keep.user.name} />
	</div>

	{#if modalOpen}
		<div class="bg-black/50 fixed top-0 left-0 z-10 flex items-center justify-center w-screen h-screen" on:click={() => (modalOpen = false)} on:keydown={() => (modalOpen = false)}>
			<div on:click|stopPropagation on:keydown|stopPropagation class="flex bg-white">
				<img src={keep.img} class="object-cover w-1/2 h-full" alt={keep.name} />
				<div class="flex flex-col flex-grow gap-1 p-2">
					<h2 class="text-center"><i class="mdi mdi-eye" /> {keep.views} | <i class="mdi mdi-share" />{keep._count.vaults}</h2>
					<h1 class="p-1 text-xl">{keep.name}</h1>
					<p class="p-1">{keep.description}</p>
					<div class="flex items-end justify-between flex-grow">
						<div>
							<select>
								{#each $myVaults as vault (vault.id)}
									<option value={vault.id}>{vault.name}</option>
								{/each}
							</select>
							<button class="bg-fuchsia-800/50 p-1 px-2 rounded-md">Save Keep</button>
						</div>
						<a href={`/profile/${keep.userId}`} class="m-2 text-blue-400 underline">{keep.user.name}</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	.aboslute {
		position: absolute;
	}
</style>
