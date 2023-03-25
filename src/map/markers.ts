import type { LngLatLike, Map } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import type { Bot } from '../types';

export const initMarkers = (map: Map, bots: Bot[]): mapboxgl.Marker[] => {
	const markers: mapboxgl.Marker[] = [];
	for (const bot of bots) {
		// Create a DOM element for each marker.
		const el = document.createElement('div');
		const width = 60;
		const height = 70;
		el.className = `robot-id-${bot.id}`;
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
			window.alert(
				`Status: ${bot.status}\nPosition: ${bot.location.lat}, ${bot.location.lng}`
			);
		});

		// Add markers to the map.
		const marker = new mapboxgl.Marker(el)
			.setLngLat([bot.location.lat, bot.location.lng] as LngLatLike)
			.addTo(map);
		markers.push(marker);
	}
	return markers;
};

export const animateMarkerMovement = (
	marker: mapboxgl.Marker,
	oldBot: Bot,
	newBot: Bot,
	duration: number
) => {
	const startLocation = [oldBot.location.lat, oldBot.location.lng];
	const endLocation = [newBot.location.lat, newBot.location.lng];
	const startTime = Date.now();

	// console.log(`startLocation: `, startLocation);
	// console.log(`endLocation: `, endLocation);
	// console.log(`startTime: `, startTime);

	const animate = () => {
		const elapsedTime = Date.now() - startTime;
		const progress = Math.min(elapsedTime / duration, 1); // limit to 1
		const lat = startLocation[0] + (endLocation[0] - startLocation[0]) * progress;
		const lng = startLocation[1] + (endLocation[1] - startLocation[1]) * progress;
		marker.setLngLat([lat, lng] as LngLatLike);

		if (progress < 1) {
			requestAnimationFrame(animate);
		}
	};

	animate();
};
