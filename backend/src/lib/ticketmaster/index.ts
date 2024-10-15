import type { EventParams, ParsedEvent, TicketmasterEvent, TicketmasterResponse } from "@/lib/ticketmaster/types";
import { formatDate, parseEvents } from "@/lib/ticketmaster/utils";
import { logger } from "@/logger";

class TicketmasterAPI {
	private apiKey: string;
	private baseURL = "https://app.ticketmaster.com/discovery/v2";
	private lastRequestTime = 0;
	private requestInterval = 200; // 200ms between requests (5 requests per second)

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private async delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private async request(endpoint: string, params: Record<string, unknown> = {}): Promise<unknown> {
		const now = Date.now();
		const timeToWait = this.requestInterval - (now - this.lastRequestTime);
		if (timeToWait > 0) {
			await this.delay(timeToWait);
		}

		const url = new URL(`${this.baseURL}${endpoint}`);
		url.search = new URLSearchParams({ ...params, apikey: this.apiKey }).toString();

		try {
			const response = await fetch(url.toString());
			this.lastRequestTime = Date.now();

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`API Error: ${response.status} - ${errorText}`);
			}

			return await response.json();
		} catch (error) {
			logger.error(`Ticketmaster API request failed: ${error}`);
			throw error;
		}
	}

	async getNFLEvents(params: EventParams): Promise<ParsedEvent[]> {
		const nflParams = {
			classificationName: "Football",
			subGenreId: "KZazBEonSMnZfZ7vFE1", // NFL subgenre ID
			size: 200, // Max allowed by API
			sort: "date,asc",
			...params,
			startDateTime: formatDate(params.startDateTime),
			endDateTime: formatDate(params.endDateTime),
		};

		const response = (await this.request("/events", nflParams)) as TicketmasterResponse;
		return parseEvents(response._embedded?.events || []);
	}

	async getEvent(id: string): Promise<ParsedEvent> {
		const response = (await this.request(`/events/${id}`)) as TicketmasterEvent;
		return parseEvents([response])[0];
	}

	async getVenue(id: string) {
		return this.request(`/venues/${id}`);
	}

	async getTeam(id: string) {
		return this.request(`/attractions/${id}`);
	}
}

export default TicketmasterAPI;
