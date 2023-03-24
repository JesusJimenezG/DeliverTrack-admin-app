<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let email = '';
	let password = '';

	async function handleSubmit() {
		// Send the login credentials to the parent component
		dispatch('login', { email, password });
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<label for="email">Email:</label>
	<input type="email" id="email" bind:value={email} required />

	<label for="password">Password:</label>
	<input type="password" id="password" bind:value={password} required />

	<button type="submit">Log in</button>
</form>
