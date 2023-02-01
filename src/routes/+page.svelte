<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { page } from '$app/stores'

	let serverData: Object = {}
	async function getServerSession() {
		const res = await fetch('/api/account')
		serverData = await res.json()
	}
</script>

<button on:click={getServerSession}>Test Api</button>
<div>
	{#if serverData}
		{JSON.stringify(serverData)}
	{/if}
</div>
<div>
	{JSON.stringify($page.data)}
</div>
<h1>SvelteKit Auth Example</h1>
<p>
	{#if $page.data.session}
		{#if $page.data.session.user?.image}
			<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
		{/if}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
			<img src={$page.data.session.user?.image} alt="avatar" />
		</span>
		<button on:click={() => signOut()} class="bg-red-300">Sign out</button>
	{:else}
		<span class="notSignedInText">You are not signed in</span>
		<button on:click={() => signIn('auth0')}>Sign In with auth0</button>
	{/if}
</p>
