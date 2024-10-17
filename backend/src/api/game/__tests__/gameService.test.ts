import { StatusCodes } from "http-status-codes";

import { type GameFilterParams, type GameQueryResult, GameService, type RawGameQueryResult } from "@/api/game/";
import type { DBInstance } from "@/models/database";
import type { Stadium } from "@/models/entities/stadium";
import type { Team } from "@/models/entities/team";
import { ServiceResponse } from "@/models/serviceResponse";
import * as gameRepository from "@/repositories/gameRepository";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";

vi.mock("@/lib/database", () => ({ default: {} as DBInstance }));
vi.mock("@/repositories/teamRepository");
vi.mock("@/repositories/stadiumRepository");
vi.mock("@/repositories/gameRepository");

describe("GameService", () => {
	let gameService: GameService;
	let mockDatabase: DBInstance;

	beforeEach(() => {
		mockDatabase = {} as DBInstance;
		gameService = new GameService(mockDatabase);
	});

	describe("getGames", () => {
		it("should return games successfully", async () => {
			// Arrange
			const mockGames: RawGameQueryResult[] = [
				{
					id: "462966fc-5cbd-49ae-a010-4a4fcabaf89d",
					name: "Tampa Bay Buccaneers vs. San Francisco 49ers",
					start_date: new Date("2024-11-11T00:00:00.000Z"),
					end_date: new Date("2024-11-11T04:00:00.000Z"),
					status: "onsale",
					min_price: null,
					max_price: null,
					stadium_id: "cfd917b4-b830-4cd1-b86b-8c3c24a94477",
					team_names: "Tampa Bay Buccaneers,San Francisco 49ers",
				},
			];
			const expectedGames: GameQueryResult[] = [
				{ ...mockGames[0], team_names: ["Tampa Bay Buccaneers", "San Francisco 49ers"] },
			];
			const expectedResponse = ServiceResponse.success("Games retrieved successfully", expectedGames);
			vi.mocked(gameRepository.queryGames).mockResolvedValue(mockGames);

			// Act
			const result: ServiceResponse<GameQueryResult[]> = await gameService.getGames({});

			// Assert
			expect(result).toEqual(expectedResponse);
		});

		it("should handle errors when fetching games", async () => {
			// Arrange
			const expectedResponse = ServiceResponse.failure("Failed to fetch games", [], StatusCodes.INTERNAL_SERVER_ERROR);
			vi.mocked(gameRepository.queryGames).mockRejectedValue(new Error("Database error"));

			// Act
			const result: ServiceResponse<GameQueryResult[]> = await gameService.getGames({});

			// Assert
			expect(result).toEqual(expectedResponse);
		});

		it("should apply filters correctly", async () => {
			// Arrange
			const filters: GameFilterParams = {
				startDate: new Date("2024-11-10 18:00:00"),
				endDate: new Date("2024-11-10 22:00:00"),
				teamId: "462966fc-5cbd-49ae-a010-4a4fcabaf89d",
				stadiumId: "cfd917b4-b830-4cd1-b86b-8c3c24a94477",
				status: "onsale",
			};
			const mockGames: RawGameQueryResult[] = [
				{
					id: "462966fc-5cbd-49ae-a010-4a4fcabaf89d",
					name: "Tampa Bay Buccaneers vs. San Francisco 49ers",
					start_date: new Date("2024-11-11T00:00:00.000Z"),
					end_date: new Date("2024-11-11T04:00:00.000Z"),
					status: "onsale",
					min_price: null,
					max_price: null,
					stadium_id: "cfd917b4-b830-4cd1-b86b-8c3c24a94477",
					team_names: "Tampa Bay Buccaneers,San Francisco 49ers",
				},
			];
			const expectedGames: GameQueryResult[] = [
				{ ...mockGames[0], team_names: ["Tampa Bay Buccaneers", "San Francisco 49ers"] },
			];
			const expectedResponse = ServiceResponse.success("Games retrieved successfully", expectedGames);
			vi.mocked(gameRepository.queryGames).mockResolvedValue(mockGames);

			// Act
			const result: ServiceResponse<GameQueryResult[]> = await gameService.getGames(filters);

			// Assert
			expect(result).toEqual(expectedResponse);
		});
	});

	describe("getTeams", () => {
		it("should return all teams", async () => {
			// Arrange
			const mockTeams: Team[] = [
				{
					id: "22e5765f-abc8-4db7-a0b8-4fac68534109",
					name: "Test Team",
					city: "Test City",
					state: "Test State",
					country: "Test Country",
				},
			];
			const expectedResponse = ServiceResponse.success("Teams retrieved successfully", mockTeams);
			vi.mocked(teamRepository.findAll).mockResolvedValue(mockTeams);

			// Act
			const result: ServiceResponse<Team[]> = await gameService.getTeams();

			// Assert
			expect(result).toEqual(expectedResponse);
		});
	});

	describe("getStadiums", () => {
		it("should return all stadiums", async () => {
			// Arrange
			const mockStadiums: Stadium[] = [
				{
					id: "eaa3ab23-de89-4015-b6ce-8fb8b0194fb3",
					name: "Test Stadium",
					city: "Test City",
					state: "Test State",
					country: "Test Country",
					zipcode: "12345",
					address: "123 Test St",
					timezone: "Test Timezone",
					lon: 0,
					lat: 0,
				},
			];
			const expectedResponse = ServiceResponse.success("Stadiums retrieved successfully", mockStadiums);
			vi.mocked(stadiumRepository.findAll).mockResolvedValue(mockStadiums);

			// Act
			const result: ServiceResponse<Stadium[]> = await gameService.getStadiums();

			// Assert
			expect(result).toEqual(expectedResponse);
		});
	});
});
