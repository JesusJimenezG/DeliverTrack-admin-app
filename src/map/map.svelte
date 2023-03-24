<script lang="ts">
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import { markersStore } from '../store/store';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import type { Bot } from '../types';
	import { initMap } from './map';
	import { initMarkers } from './markers';

	let botsOn = false;
	let bots: Bot[] = [];

	// let map: Map;
	const startEngines = async () => {
		const response = await fetch('http://localhost/api/live-tracking/start-bots', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.token}`
			},
			body: JSON.stringify({ token: sessionStorage.token })
		});

		if (response.status === 200) {
			const data = await response.json();
			botsOn = true;
			fetchBots();
			window.alert(data.message);
		}

		// const socket = io('http://localhost/', {
		// 	transports: ['websocket', 'polling', 'flashsocket']
		// });
		// Add event listeners and emit events as needed
		// socket.on('updateBotLocation', (data: Bot) => {
		// 	console.log('Received message:', data);
		// 	// bots.push(data);
		// });
		// socket.on('disconnect', () => {
		// 	console.log('Disconnected from Socket.IO server');
		// });
	};

	const fetchBots = async () => {
		const response = await fetch('http://localhost/api/live-tracking/get-bots', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.token}`
			}
		});

		if (response.status === 200) {
			const data = await response.json();
			window.alert(data.message);
		}
	};

	onMount(() => {
		const map = initMap();
		markersStore.subscribe((markers) => {
			initMarkers(map, markers);
		});
	});
</script>

<div id="map" />
<button class="material-button" on:click={startEngines}>Start Engines 🤖</button>

<table id="bot-table" class="mdc-data-table__table">
  <thead>
    <tr class="mdc-data-table__header-row">
      <th class="mdc-data-table__header-cell" role="columnheader" scope="col">ID</th>
      <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Status</th>
      <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Location</th>
    </tr>
  </thead>
  <tbody class="mdc-data-table__content">
    {#each bots as bot}
      <tr class="mdc-data-table__row">
        <td class="mdc-data-table__cell">{bot.id}</td>
        <td class="mdc-data-table__cell">{bot.status}</td>
        <td class="mdc-data-table__cell">{bot.location.lat}, {bot.location.lng}</td>
      </tr>
    {/each}
  </tbody>
</table>


<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">

<style>
	#bot-table{
		position: absolute;
		top: 5%;
		right: 1%;
		min-width: 350px;
		width: 70px;
		z-index: 1000;
	}
	.mdc-data-table__cell {
		width: 33%;
		z-index: 1000;
	}
	.material-button {
		position: absolute;
		top: 80%;
		right: 42.5%;
		font-weight: 500;
		text-align: center;
		white-space: nowrap;
		vertical-align: middle;
		user-select: none;
		border: 1px solid transparent;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		line-height: 1.5;
		border-radius: 0.25rem;
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
		transition: all 0.15s ease-in-out;
		background-color: #007bff;
		color: #fff;
		z-index: 1000;
	}

	.material-button:hover,
	.material-button:focus {
		background-color: #0069d9;
		color: #fff;
		text-decoration: none;
		border: 1px solid #0062cc;
		outline: none;
	}

	.material-button:active {
		background-color: #0062cc;
		border: 1px solid #005cbf;
		box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
	}
	#map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	}
</style>
