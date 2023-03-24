<script lang="ts">
	import Map from '../../map/map.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const token = sessionStorage.getItem('token');
		if (!token || token === undefined || token === 'undefined') {
			window.alert('You are not logged in!');
			window.location.href = '/login';
		}
	});
</script>

<body>
	<Map />
</body>

<style>
	body {
		width: 100vh;
		height: 100vh;
		margin: 0;
		padding: 0;
		background: #fff;
		font-family: sans-serif;
		overflow: hidden;
	}
</style>
