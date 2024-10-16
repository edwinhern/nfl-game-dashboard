import { GameService } from "@/api/game/gameService";
import type { DBInstance } from "@/models/database";
import type { Stadium } from "@/models/entities/stadium";
import type { Team } from "@/models/entities/team";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";

vi.mock("@/lib/database", () => ({ default: {} as DBInstance }));
vi.mock("@/repositories/teamRepository");
vi.mock("@/repositories/stadiumRepository");

describe("GameService", () => {
	let gameService: GameService;
	let mockDatabase: DBInstance;

	beforeEach(() => {
		mockDatabase = {} as DBInstance;
		gameService = new GameService(mockDatabase);
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
			vi.mocked(teamRepository.findAll).mockResolvedValue(mockTeams);

			// Act
			const result = await gameService.getTeams();

			// Assert
			expect(result).toEqual(mockTeams);
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
			vi.mocked(stadiumRepository.findAll).mockResolvedValue(mockStadiums);

			// Act
			const result = await gameService.getStadiums();

			// Assert
			expect(result).toEqual(mockStadiums);
		});
	});
});
