<script lang="ts">
	import type { Vault } from '@prisma/client'
	export let vault: Vault
</script>

<div class="relative w-52 max-w-md">
	<a href={'/vault/' + vault.id}>
		<img src={vault.img} alt={vault.name} class=" h-full w-full rounded-md brightness-75" />
		<h1 class="absolute left-0 top-0 p-1 text-2xl font-bold text-white">{vault.name}</h1>
		{#if vault.isPrivate}
			<i class="mdi mdi-lock absolute right-0 bottom-0 p-1 text-3xl text-red-600" />
		{/if}
	</a>
</div>
