export interface Team {
	id: string;
	name: string;
	city: string;
	state: string;
	country: string;
}

export interface NewTeam extends Omit<Team, "id"> {}
export interface TeamUpdate extends Partial<NewTeam> {}
