<script lang="ts">
	import LoginModal from '../../login/LoginModal.svelte';
	import { onMount } from 'svelte';

	// onMount(() => {
	// 	const token = sessionStorage.getItem('token');
	// 	if (token) {
	// 		window.location.href = '/';
	// 	}
	// });

	let isLoggedIn = false;

	async function handleLogin(event: any) {
		// Here you can implement the logic to authenticate the user with the backend
		// console.log(event.detail);
		const { email, password } = event.detail;
		const response = await fetch('http://localhost/api/auth/login', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password })
		});
		

		const { data } = await response.json();
		if (response.status === 200) {
			sessionStorage.token = data;
			isLoggedIn = true;
			window.location.href = '/map';
		}
	}
</script>

{#if isLoggedIn}
	<div>You are logged in!</div>
{:else}
	<LoginModal on:login={handleLogin} />
{/if}
