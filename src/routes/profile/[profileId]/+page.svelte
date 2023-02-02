<script>
	import { page } from '$app/stores'
	import axios from 'axios'
	import Keep from '$lib/Keep.svelte'
</script>

{JSON.stringify($page.data)}
