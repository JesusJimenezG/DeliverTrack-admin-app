<script lang="ts">
	import LoginForm from './LoginForm.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let show = true;

	function handleLogin(event: any) {
		// Send the login credentials to the parent component
		dispatch('login', event.detail);
	}
</script>

<!-- <button on:click={() => dispatch('show')}>Log in</button> -->

{#if show}
	<div class="modal">
		<div class="modal-content">
			<h2>Login</h2>
			<LoginForm on:login={handleLogin} />
		</div>
	</div>
{/if}

<style>
	.modal {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background-color: #fff;
		border-radius: 5px;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}

	.button {
		padding: 0.5rem 1rem;
		margin-top: 1rem;
		border: none;
		border-radius: 5px;
		background-color: #3f51b5;
		color: #fff;
		font-weight: bold;
		cursor: pointer;
	}

	.button:hover {
		background-color: #2c387e;
	}
</style>
