import type { GameStatus } from "@/models/game";

export const STATUS_MAP: Record<string, GameStatus> = {
	onsale: "onsale",
	offsale: "offsale",
	canceled: "cancelled",
	postponed: "rescheduled",
	rescheduled: "rescheduled",
	presale: "presale",
	active: "active",
	inactive: "inactive",
};
