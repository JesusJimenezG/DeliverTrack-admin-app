import { writable } from 'svelte/store';
import type { BotMarkers } from '../types';

const botMarkers: BotMarkers = [
	{
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

const markersStore = writable(botMarkers);

export { markersStore };
