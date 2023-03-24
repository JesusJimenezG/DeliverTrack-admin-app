export type Bot = {
	id: string;
	status: string;
	location: {
		lat: number;
		lng: number;
	};
};

export type BotMarkers = {
	type: string;
	properties: { status: string; iconSize: number[] };
	geometry: { type: string; coordinates: number[] };
}[];
