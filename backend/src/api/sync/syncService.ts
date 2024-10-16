import type { UUID } from "node:crypto";
import cronParser from "cron-parser";

import env from "@/env";
import db from "@/lib/database";
import type TicketmasterAPI from "@/lib/ticketmaster";
import type { ParsedEvent } from "@/lib/ticketmaster/types";
import { logger } from "@/logger";
import type { Game, InsertGame } from "@/models/game";
import type { InsertGameTeam } from "@/models/gameTeam";
import * as gameRepository from "@/repositories/gameRepository";
import * as gameTeamRepository from "@/repositories/gameTeamRepository";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";
import * as ticketVendorRepository from "@/repositories/ticketVendorRepository";

export class SyncService {
	private ticketmasterAPI: TicketmasterAPI;
	private mappedTeams: Map<string, UUID>;
	private mappedStadiums: Map<string, UUID>;

	constructor(ticketmasterAPI: TicketmasterAPI) {
		this.ticketmasterAPI = ticketmasterAPI;
		this.mappedTeams = new Map();
		this.mappedStadiums = new Map();
	}

	public async syncGames(): Promise<void> {
		logger.info("Starting game sync process");
		try {
			await this.loadMappedEntities();

			const dateRange = this.getDateRange();
			let page = 0;
			let totalPages = 1;

			while (page < totalPages) {
				const result = await this.fetchEventsPage(dateRange, page);
				totalPages = result.pagination.totalPages;
				page += 1;

				await this.processEvents(result.events);
				logger.info(`Processed page ${page} of ${totalPages}`);
			}

			logger.info("Game sync completed successfully");
		} catch (error) {
			logger.error("Error syncing games from Ticketmaster:", error);
			throw new Error("Game sync failed");
		}
	}

	private async loadMappedEntities(): Promise<void> {
		logger.info("Loading mapped entities");
		try {
			const [teams, stadiums] = await Promise.all([teamRepository.findAll(db), stadiumRepository.findAll(db)]);

			this.mappedTeams = new Map(teams.map((team) => [team.name, team.id]));
			this.mappedStadiums = new Map(stadiums.map((stadium) => [stadium.name, stadium.id]));

			logger.info(`Loaded ${this.mappedTeams.size} teams and ${this.mappedStadiums.size} stadiums`);
		} catch (error) {
			logger.error("Error loading mapped entities:", error);
			throw new Error("Failed to load mapped entities");
		}
	}

	private getDateRange(): { startDateTime: Date; endDateTime: Date } {
		const startDateTime = new Date();
		const endDateTime = new Date();
		endDateTime.setMonth(endDateTime.getMonth() + 1);
		return { startDateTime, endDateTime };
	}

	private async fetchEventsPage(dateRange: { startDateTime: Date; endDateTime: Date }, page: number) {
		logger.info(`Fetching events page ${page + 1}`);
		try {
			return await this.ticketmasterAPI.getNFLEvents({
				startDateTime: dateRange.startDateTime,
				endDateTime: dateRange.endDateTime,
				page: page.toString(),
			});
		} catch (error) {
			logger.error(`Error fetching events page ${page + 1}:`, error);
			throw new Error(`Failed to fetch events page ${page + 1}`);
		}
	}

	private async processEvents(events: ParsedEvent[]): Promise<void> {
		for (const event of events) {
			try {
				if (this.isEventValid(event)) {
					await this.upsertGame(event);
					logger.info(`Processed event: ${event.id}, ${event.name}`);
				} else {
					logger.warn(`Skipping invalid event: ${event.id}, ${event.name}`);
				}
			} catch (error) {
				logger.error(`Error processing event ${event.id}:`, error);
			}
		}
	}

	private isEventValid(event: ParsedEvent): boolean {
		// Check if venue exists in database
		if (!event.stadium_name || !this.mappedStadiums.has(event.stadium_name)) {
			logger.warn(`Event ${event.id}: Invalid stadium name '${event.stadium_name}'`);
			return false;
		}

		// Check if all teams exist in database
		if (!event.team_names || event.team_names.length === 0) {
			logger.warn(`Event ${event.id}: No teams found`);
			return false;
		}

		for (const teamName of event.team_names) {
			if (!this.mappedTeams.has(teamName)) {
				logger.warn(`Event ${event.id}: Invalid team name '${teamName}'`);
				return false;
			}
		}

		return true;
	}

	private shouldUpdateGame(lastUpdateTime: Date): boolean {
		try {
			const interval = cronParser.parseExpression(env.SYNC_SCHEDULE);
			const lastScheduledRun = interval.prev().toDate();
			return lastUpdateTime <= lastScheduledRun;
		} catch (error) {
			logger.error(`Error parsing cron expression: ${error}`);
			return true;
		}
	}

	private async upsertGame(event: ParsedEvent): Promise<void> {
		// Get stadium ID from database
		const stadiumId = this.mappedStadiums.get(event.stadium_name as string);
		if (!stadiumId) {
			logger.warn(`Stadium not found: ${event.stadium_name}`);
			return;
		}

		// Get ticket vendor ID from database - For example, Ticketmaster
		// If we need to map from API, it may be inside `promoter` field
		const ticketVendor = await ticketVendorRepository.findByName(db, "Ticketmaster");
		if (!ticketVendor) {
			logger.warn(`Ticket vendor not found: ${event}`);
			return;
		}

		// Check if game needs to be updated
		const existingGame = await gameRepository.findByEventId(db, event.id);
		if (existingGame?.updated_at && !this.shouldUpdateGame(existingGame.updated_at)) {
			logger.info(`Skipping update for game ${event.id}: Recently updated`);
			return;
		}

		const gameData: InsertGame = {
			name: event.name,
			event_id: event.id,
			stadium_id: stadiumId,
			ticket_vendor_id: ticketVendor.id,
			start_date: event.start_date,
			end_date: event.end_date,
			status: event.status,
			min_price: event.min_price,
			max_price: event.max_price,
			presale_date: event.presale_date,
			onsale_date: event.onsale_date,
			offsale_date: event.offsale_date,
		};

		const upsertedGame = (await gameRepository.upsertGame(db, gameData)) as Game;

		// Upsert teams
		if (upsertedGame && event.team_names) {
			for (const teamName of event.team_names) {
				const teamId = this.mappedTeams.get(teamName);
				if (!teamId) {
					logger.warn(`Team not found: ${teamName}`);
					continue;
				}

				const gameTeamData: InsertGameTeam = {
					game_id: upsertedGame.id,
					team_id: teamId,
				};

				await gameTeamRepository.upsertGameTeam(db, gameTeamData);
			}
		}
	}
}
