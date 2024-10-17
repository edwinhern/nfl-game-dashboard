import type { UUID } from "node:crypto";
import cronParser from "cron-parser";
import { StatusCodes } from "http-status-codes";

import { MIN_TEAMS_PER_EVENT } from "@/api/sync";
import env from "@/env";
import type TicketmasterAPI from "@/lib/ticketmaster";
import type { ParsedEvent } from "@/lib/ticketmaster/types";
import { logger } from "@/middleware/logger";
import type { DBInstance } from "@/models/database";
import type { InsertGame } from "@/models/entities/game";
import type { InsertGameTeam } from "@/models/entities/gameTeam";
import { ServiceResponse } from "@/models/serviceResponse";
import * as gameRepository from "@/repositories/gameRepository";
import * as gameTeamRepository from "@/repositories/gameTeamRepository";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";
import * as ticketVendorRepository from "@/repositories/ticketVendorRepository";

export class SyncService {
	private ticketmasterAPI: TicketmasterAPI;
	private db: DBInstance;
	private mappedTeams: Map<string, UUID>;
	private mappedStadiums: Map<string, UUID>;
	private mappedTicketVendors: Map<string, UUID>;

	constructor(ticketmasterAPI: TicketmasterAPI, database: DBInstance) {
		this.ticketmasterAPI = ticketmasterAPI;
		this.db = database;

		this.mappedTeams = new Map();
		this.mappedStadiums = new Map();
		this.mappedTicketVendors = new Map();
	}

	public async getNextSyncTime(): Promise<ServiceResponse<{ nextSync: Date | null }>> {
		try {
			const interval = cronParser.parseExpression(env.SYNC_SCHEDULE);
			const nextRun = interval.next().toDate();

			return ServiceResponse.success("Next sync time determined", { nextSync: nextRun });
		} catch (error) {
			logger.error("Error parsing cron expression:", error);
			const response = { nextSync: null };
			return ServiceResponse.failure("Failed to determine next sync time", response, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	public async syncGames(): Promise<ServiceResponse<{ totalProcessedEvents: number; totalSkippedEvents: number }>> {
		logger.info("Starting game sync process");

		try {
			await this.loadMappedEntities();

			const dateRange = this.getDateRange();
			let page = 0;
			let totalPages = 1;
			let totalProcessedEvents = 0;
			let totalSkippedEvents = 0;

			while (page < totalPages) {
				const result = await this.fetchEventsPage(dateRange, page);
				totalPages = result.pagination.totalPages;
				page += 1;

				const { processedEvents, skippedEvents } = await this.processEvents(result.events);
				totalProcessedEvents += processedEvents;
				totalSkippedEvents += skippedEvents;

				logger.info(
					`Processed page ${page} of ${totalPages}: ${processedEvents} events processed, ${skippedEvents} events skipped`,
				);
			}

			logger.info(
				`Game sync completed successfully. Total events processed: ${totalProcessedEvents}, Total events skipped: ${totalSkippedEvents}`,
			);

			const response = { totalProcessedEvents, totalSkippedEvents };
			return ServiceResponse.success("Game sync completed successfully", response);
		} catch (error) {
			logger.error("Error syncing games from Ticketmaster:", error);
			const response = { totalProcessedEvents: 0, totalSkippedEvents: 0 };
			return ServiceResponse.failure("Game sync failed", response, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	private async loadMappedEntities(): Promise<void> {
		try {
			const [teams, stadiums, ticketVendors] = await Promise.all([
				teamRepository.findAll(this.db),
				stadiumRepository.findAll(this.db),
				ticketVendorRepository.findAll(this.db),
			]);

			this.mappedTeams = new Map(teams.map((team) => [team.name, team.id]));
			this.mappedStadiums = new Map(stadiums.map((stadium) => [stadium.name, stadium.id]));
			this.mappedTicketVendors = new Map(ticketVendors.map((vendor) => [vendor.name, vendor.id]));

			logger.info(
				`Loaded ${this.mappedTeams.size} teams, ${this.mappedStadiums.size} stadiums, and ${this.mappedTicketVendors.size} ticket vendors`,
			);
		} catch (error) {
			logger.error("Error loading mapped entities:", error);
			throw new Error("Failed to load mapped entities");
		}
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

	private async processEvents(events: ParsedEvent[]): Promise<{ processedEvents: number; skippedEvents: number }> {
		let processedEvents = 0;
		let skippedEvents = 0;

		for (const event of events) {
			try {
				if (this.isEventValid(event)) {
					await this.upsertGame(event);
					processedEvents += 1;
				} else {
					skippedEvents += 1;
				}
			} catch (error) {
				logger.error(`Error processing event ${event.id}:`, error);
				skippedEvents++;
			}
		}

		return { processedEvents, skippedEvents };
	}

	private getDateRange(): { startDateTime: Date; endDateTime: Date } {
		const startDateTime = new Date();
		const endDateTime = new Date();
		endDateTime.setMonth(endDateTime.getMonth() + 1);
		return { startDateTime, endDateTime };
	}

	private isEventValid(event: ParsedEvent): boolean {
		// Check if venue exists in database
		if (!event.stadium_name || !this.mappedStadiums.has(event.stadium_name)) {
			logger.debug(`Event ${event.id}: Invalid stadium name '${event.stadium_name}'`);
			return false;
		}

		// Check if all teams exist in database and there are at least two teams
		if (!event.team_names || event.team_names.length < MIN_TEAMS_PER_EVENT) {
			logger.debug(
				`Event ${event.id}: Insufficient number of teams. Found ${event.team_names?.length ?? 0}, required ${MIN_TEAMS_PER_EVENT}`,
			);
			return false;
		}

		for (const teamName of event.team_names) {
			if (!this.mappedTeams.has(teamName)) {
				logger.debug(`Event ${event.id}: Invalid team name '${teamName}'`);
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
		const ticketVendorId = this.mappedTicketVendors.get("Ticketmaster");
		if (!ticketVendorId) {
			logger.warn(`Ticket vendor not found: ${event}`);
			return;
		}

		// Check if game needs to be updated
		const existingGame = await gameRepository.findByEventId(this.db, event.id);
		if (existingGame?.updated_at && !this.shouldUpdateGame(existingGame.updated_at)) {
			logger.debug(`Skipping update for game ${event.id}: Recently updated`);
			return;
		}

		const gameData: InsertGame = {
			name: event.name,
			event_id: event.id,
			stadium_id: stadiumId,
			ticket_vendor_id: ticketVendorId,
			start_date: event.start_date,
			end_date: event.end_date,
			status: event.status,
			min_price: event.min_price,
			max_price: event.max_price,
			presale_date: event.presale_date,
			onsale_date: event.onsale_date,
			offsale_date: event.offsale_date,
		};

		const upsertedGame = await gameRepository.upsertGame(this.db, gameData);

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

				await gameTeamRepository.upsertGameTeam(this.db, gameTeamData);
			}
		}
	}
}
