import env from "@/env";
import db from "@/lib/database";
import TicketmasterAPI from "@/lib/ticketmaster";
import type { ParsedEvent } from "@/lib/ticketmaster/types";
import { logger } from "@/logger";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";

export class DataSyncService {
	private ticketmasterAPI: TicketmasterAPI;
	private mappedTeams: Set<string>;
	private mappedStadiums: Set<string>;

	constructor(apiKey: string = env.TICKETMASTER_API_KEY) {
		this.ticketmasterAPI = new TicketmasterAPI(apiKey);
		this.mappedTeams = new Set();
		this.mappedStadiums = new Set();
	}

	public async syncGames(): Promise<void> {
		try {
			await this.loadMappedEntities();

			const oneMonthFromNow = new Date();
			oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

			const events = await this.ticketmasterAPI.getNFLEvents({
				startDateTime: new Date(),
				endDateTime: oneMonthFromNow,
			});

			for (const event of events) {
				if (this.isEventValid(event)) {
					// Do something with the event
					logger.info(`Syncing event: ${event.id}, ${event.name}`);
				} else {
					logger.warn(`Skipping event with unmapped data: ${event.id}`);
				}
			}
		} catch (error) {
			logger.error("Error syncing games from Ticketmaster:", error);
		}
	}

	private async loadMappedEntities(): Promise<void> {
		const teamNames = await teamRepository.findAllNames(db);
		const stadiumNames = await stadiumRepository.findAllNames(db);

		this.mappedTeams = new Set(teamNames);
		this.mappedStadiums = new Set(stadiumNames);
	}

	private isEventValid(event: ParsedEvent): boolean {
		// Check if venue exists in database
		if (!event.stadium_name || !this.mappedStadiums.has(event.stadium_name)) {
			return false;
		}

		// Check if all teams exist in database
		if (event.team_names?.some((teamName) => !this.mappedTeams.has(teamName))) {
			return false;
		}

		return true;
	}
}
