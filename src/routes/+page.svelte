<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		console.log(`at root`);
		const token = sessionStorage.getItem('token');
		if (!token || token === undefined || token === 'undefined') {
			window.alert('You are not logged in!');
			window.location.href = '/login';
		} else {
			window.location.href = '/map';
		}
	});
</script>
