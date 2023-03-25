import { writable } from 'svelte/store';
import type { BotMarkers, BotsStoreValue } from '../types';

const botMarkers: BotMarkers = [
	{
		id: '1',
		type: 'Robot',
		properties: {
			status: 'Idle',
			iconSize: [60, 70]
		},
		geometry: {
			type: 'Point',
			coordinates: [-122.431297, 37.773972]
		}
	},
	{
		id: '2',
		type: 'Robot',
		properties: {
			status: 'Idle',
			iconSize: [60, 70]
		},
		geometry: {
			type: 'Point',
			coordinates: [-122.435402, 37.767817]
		}
	},
	{
		id: '3',
		type: 'Robot',
		properties: {
			status: 'Idle',
			iconSize: [60, 70]
		},
		geometry: {
			type: 'Point',
			coordinates: [-122.416667, 37.783333]
		}
	}
];

// const markersStore = writable(botMarkers);
const botsStore = writable<BotsStoreValue>();

export { botsStore };
