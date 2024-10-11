export type GameStatus = "onsale" | "presale" | "active" | "inactive" | "cancelled" | "rescheduled" | "offsale";

export interface Game {
	id: string;
	name: string;
	stadium_id: string;
	ticket_vendor_id: string;
	start_date: Date;
	end_date: Date;
	presale_date: Date | null;
	onsale_date: Date | null;
	offsale_date: Date | null;
	min_price: number | null;
	max_price: number | null;
	status: GameStatus;
}

export interface NewGame extends Omit<Game, "id"> {}
export interface GameUpdate extends Partial<NewGame> {}
