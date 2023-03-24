import type { LngLatLike, Map } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import type { BotMarkers } from '../types';

export const initMarkers = (map: Map, markers: BotMarkers) => {
	for (const marker of markers) {
		// Create a DOM element for each marker.
		const el = document.createElement('div');
		const width = marker.properties.iconSize[0];
		const height = marker.properties.iconSize[1];
		el.className = 'robot';
		el.style.backgroundImage = `url(/robot.png)`;
		el.style.width = `${width}px`;
		el.style.height = `${height}px`;
		el.style.backgroundSize = '100%';
		el.style.backgroundRepeat = 'no-repeat';
		el.style.display = 'block';
		el.style.border = 'none';
		el.style.cursor = 'pointer';
		el.style.padding = '0';

		el.addEventListener('click', () => {
			window.alert(marker.properties.status);
		});

		// Add markers to the map.
		// Add markers to the map.
		new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates as LngLatLike).addTo(map);
	}
};
