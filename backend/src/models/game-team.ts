export interface GameTeam {
	game_id: string;
	team_id: string;
}

export interface NewGameTeam extends GameTeam {}
export interface GameTeamUpdate extends Partial<NewGameTeam> {}
