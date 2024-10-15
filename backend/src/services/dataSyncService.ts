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
					await this.upsertGame(event);
					logger.info(`Syncing event: ${event.id}, ${event.name}`);
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

	private async upsertGame(event: ParsedEvent): Promise<void> {
		try {
			// Get stadium ID from database
			const stadium = await stadiumRepository.findByName(db, event.stadium_name as string);
			if (!stadium) {
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

			const gameData: InsertGame = {
				name: event.name,
				stadium_id: stadium.id,
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
			if (event.team_names && event.team_ids) {
				for (const teamName of event.team_names) {
					const team = await teamRepository.findByName(db, teamName);
					if (!team) {
						logger.warn(`Team not found: ${teamName}`);
						continue;
					}

					const gameTeamData: InsertGameTeam = {
						game_id: upsertedGame.id,
						team_id: team.id,
					};

					await gameTeamRepository.upsertGameTeam(db, gameTeamData);
				}
			}
		} catch (error) {
			logger.error(`Error upserting game ${event.id}:`, error);
		}
	}
}
