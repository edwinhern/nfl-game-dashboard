import type { UUID } from "node:crypto";
import cronParser from "cron-parser";

import env from "@/env";
import db from "@/lib/database";
import TicketmasterAPI from "@/lib/ticketmaster";
import type { ParsedEvent } from "@/lib/ticketmaster/types";
import { logger } from "@/logger";
import type { Game, InsertGame } from "@/models/game";
import type { InsertGameTeam } from "@/models/gameTeam";
import * as gameRepository from "@/repositories/gameRepository";
import * as gameTeamRepository from "@/repositories/gameTeamRepository";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";
import * as ticketVendorRepository from "@/repositories/ticketVendorRepository";

export class DataSyncService {
	private ticketmasterAPI: TicketmasterAPI;
	private mappedTeams: Map<string, UUID>; // teamName : teamID (UUID)
	private mappedStadiums: Map<string, UUID>; // stadiumName : stadiumID (UUID)

	constructor(apiKey: string = env.TICKETMASTER_API_KEY) {
		this.ticketmasterAPI = new TicketmasterAPI(apiKey);
		this.mappedTeams = new Map();
		this.mappedStadiums = new Map();
	}

	public async syncGames(): Promise<void> {
		try {
			await this.loadMappedEntities();

			const oneMonthFromNow = new Date();
			oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

			let page = 0;
			let totalPages = 1;

			while (page < totalPages) {
				const result = await this.ticketmasterAPI.getNFLEvents({
					startDateTime: new Date(),
					endDateTime: oneMonthFromNow,
					page: page.toString(),
				});

				totalPages = result.pagination.totalPages;
				page++;

				for (const event of result.events) {
					if (this.isEventValid(event)) {
						await this.upsertGame(event);
						logger.info(`Syncing event: ${event.id}, ${event.name}`);
					}
				}

				logger.info(`Processed page ${page} of ${totalPages}`);
			}

			logger.info("Game sync completed successfully");
		} catch (error) {
			logger.error("Error syncing games from Ticketmaster:", error);
		}
	}

	private async loadMappedEntities(): Promise<void> {
		const teamNames = await teamRepository.findAll(db);
		const stadiumNames = await stadiumRepository.findAll(db);

		this.mappedTeams = new Map(teamNames.map((team) => [team.name, team.id]));
		this.mappedStadiums = new Map(stadiumNames.map((stadium) => [stadium.name, stadium.id]));
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
		try {
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
		} catch (error) {
			logger.error(`Error upserting game ${event.id}:`, error);
		}
	}
}
