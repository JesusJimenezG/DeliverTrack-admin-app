export type Bot = {
	id: string;
	status: string;
	location: {
		lat: number;
		lng: number;
	};
};

export type BotsStoreValue = Record<string, Bot>;

export type BotMarkers = {
	id: string;
	type: string;
	properties: { status: string; iconSize: number[] };
	geometry: { type: string; coordinates: number[] };
}[];
