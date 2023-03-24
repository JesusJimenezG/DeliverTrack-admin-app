import mapboxgl from 'mapbox-gl';
import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';

export const initMap = () => {
	mapboxgl.accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;

	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [-122.431297, 37.773972],
		zoom: 12
	});

	return map;
};
