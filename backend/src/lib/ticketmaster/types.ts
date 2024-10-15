import type { GameStatus } from "@/models/game";

export interface TicketmasterDates {
	start: { dateTime: string };
	end?: { dateTime: string };
	status: { code: string };
	timezone: string;
}

export interface TicketmasterSale {
	public: { startDateTime?: string; endDateTime?: string };
	presales: { startDateTime: string; endDateTime: string; name: string }[];
}

export interface TicketmasterPriceRange {
	type: string;
	currency: string;
	min: number;
	max: number;
}

// This contains stadium information
export interface TickermasterVenue {
	id: string;
	name: string;
}

// This contains team(s) information
export interface TicketmasterAttraction {
	id: string;
	name: string;
}

export interface TicketmasterEvent {
	id: string;
	name: string;
	sales: TicketmasterSale;
	dates: TicketmasterDates;
	priceRanges?: TicketmasterPriceRange[];
	_embedded?: {
		venues: TickermasterVenue[];
		attractions: TicketmasterAttraction[];
	};
}

export interface TicketmasterResponse {
	_embedded: { events: TicketmasterEvent[] };
	_links: {
		first: { href: string };
		self: { href: string };
		next: { href: string };
		prev: { href: string };
		last: { href: string };
	};
	page: { size: number; totalElements: number; totalPages: number; number: number };
}

export interface ParsedEvent {
	id: string;
	name: string;
	start_date: Date;
	end_date: Date;
	status: GameStatus;
	min_price?: number;
	max_price?: number;
	presale_date: Date | null;
	onsale_date?: Date | null;
	offsale_date?: Date | null;
	stadium_id?: string;
	stadium_name?: string;
	team_ids?: string[];
	team_names?: string[];
}

export interface EventParams {
	startDateTime?: Date | string;
	endDateTime?: Date | string;
	city?: string;
	stateCode?: string;
	countryCode?: string;
	venueId?: string;
	teamId?: string;
	keyword?: string;
	status?: string;
	size?: string;
}
