<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import { botsStore } from '../store/store';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import type { Bot } from '../types';
	import { initMap } from './map';
	import { initMarkers, animateMarkerMovement } from './markers';
	import type mapboxgl from 'mapbox-gl';

	let botsOn = false;
	let ops = false;
	let socket: Socket;
	let bots: Bot[] = [];
	let markers: mapboxgl.Marker[] = [];

	// let map: Map;
	const startEngines = async () => {
		const response = await fetch('http://localhost/api/live-tracking/start-bots', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.token}`
			},
			body: JSON.stringify({ token: sessionStorage.token })
		});

		if (response.status === 200) {
			const { data } = await response.json();
			botsOn = true;
			window.alert(data);
			await fetchBots();
		}
	};

	const startOps = async () => {
		await fetch('http://localhost/api/live-tracking/start-moving-bots', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.token}`
			}
		});
		// const {data } = await response.json();
		// window.alert(data);

		// Start socket connection to receive bot locations
		socket.emit('/start-moving-bots');

		ops = true;
	};

	const stopOps = async () => {
		// Stop socket connection
		const response = await fetch('http://localhost/api/live-tracking/stop-moving-bots', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.token}`
			}
		});
		const { data } = await response.json();
		// window.alert(data);

		socket.emit('/stop-moving-bots');
		// socket.on('');
		ops = false;
	};

	const stopEngines = async () => {
		const response = await fetch('http://localhost/api/live-tracking/shutdown-bots', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.token}`
			}
		});

		if (response.status === 200) {
			const { data } = await response.json();
			botsOn = false;
			window.alert(data);
			await fetchBots();
		}
	};

	const fetchBots = async () => {
		const response = await fetch('http://localhost/api/live-tracking/get-bots', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.token}`
			}
		});

		if (response.status === 200) {
			const { data } = await response.json();
			botsStore.set(data);
		}
	};

	onMount(async () => {
		const map = initMap();
		await fetchBots();

		if ($botsStore) {
			bots = Object.values($botsStore);
			let movingBots = false;
			for (const bot of bots) {
				botsOn = bot.status !== 'IDLE' ? true : false;
				movingBots = bot.status === 'MOVING' ? true : false;
			}
			if (movingBots) {
				startOps();
			}
			markers = initMarkers(map, bots);
		}

		botsStore.subscribe((newBots) => {
			const _bots = Object.values(newBots);
			// console.log(`newBots: `, _bots);

			const duration = 1000; // in milliseconds
			for (let i = 0; i < markers.length; i++) {
				const oldBot = bots[i];
				const newBot = _bots[i];
				const marker = markers[i];
				// console.log(`marker: `, marker);
				// console.log(`oldBot: `, oldBot);
				// console.log(`newBot: `, newBot);
				if (oldBot.location !== newBot.location) {
					animateMarkerMovement(marker, oldBot, newBot, duration);
					bots[i] = newBot;
				}
			}

			// for (const bot of bots) {
			// 	const marker = markers.find(
			// 		(marker) => marker.getElement().className.split(' ')[0].split('-')[2] === bot.id
			// 	);
			// 	if (marker) {
			// 		// requestAnimationFrame(animateMarker(marker, bot));
			// 	}
			// }
		});

		socket = io('http://localhost/', {
			auth: {
				token: sessionStorage.token
			},
			withCredentials: true,
			transports: ['websocket', 'polling', 'flashsocket']
		});

		socket.on('connection', (socket: Socket) => {
			console.log('Connected to Socket.IO server');
			socket.on('disconnect', () => {
				console.log('Disconnected from Socket.IO server');
			});
		});
		socket.on('/update-bot-locations', (data) => {
			console.log(`updated bots location`);
			botsStore.set(data);
		});
	});
</script>

<div id="map" />

{#if botsOn}
	<button class="start-ops-left" on:click={ops ? stopOps : startOps}
		>{ops ? 'Stop ops 🛑' : 'Start ops 🤖'}</button
	>
	<button class="stop-engines-right" on:click={stopEngines}>Shutdown Engines 💤</button>
{:else}
	<button class="material-button" on:click={startEngines}>Start Engines 🤖</button>
{/if}

<table id="bot-table" class="mdc-data-table__table">
	<thead>
		<tr class="mdc-data-table__header-row">
			<th class="mdc-data-table__header-cell" role="columnheader" scope="col">ID</th>
			<th class="mdc-data-table__header-cell" role="columnheader" scope="col">Status</th>
			<th class="mdc-data-table__header-cell" role="columnheader" scope="col">Location</th>
		</tr>
	</thead>
	<tbody class="mdc-data-table__content">
		{#if $botsStore}
			{#each Object.values($botsStore) as bot}
				<tr class="mdc-data-table__row">
					<td class="mdc-data-table__cell">{bot.id}</td>
					<td class="mdc-data-table__cell">{bot.status}</td>
					<td class="mdc-data-table__cell">{bot.location.lat}, {bot.location.lng}</td>
				</tr>
			{/each}
		{/if}
	</tbody>
</table>

<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<link
	href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
	rel="stylesheet"
/>

<style>
	#bot-table {
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
	.mdc-data-table__content {
		background-color: #fff;
	}
	.start-ops-left {
		position: absolute;
		top: 80%;
		right: 50%;
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
	.stop-engines-right {
		position: absolute;
		top: 80%;
		right: 30%;
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
