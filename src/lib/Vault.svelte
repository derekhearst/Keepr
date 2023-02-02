<script lang="ts">
	import type { Vault } from '@prisma/client'
	export let vault: Vault
</script>

<div class="relative max-w-md w-52">
	<a href={'/vault/' + vault.id}>
		<img src={vault.img} alt={vault.name} class=" w-full brightness-75 h-full rounded-md" />
		<h1 class="absolute text-2xl left-0 top-0 font-bold p-1 text-white">{vault.name}</h1>
		{#if vault.isPrivate}
			<i class="mdi mdi-lock absolute right-0 bottom-0 p-1 text-red-600 text-3xl" />
		{/if}
	</a>
</div>
