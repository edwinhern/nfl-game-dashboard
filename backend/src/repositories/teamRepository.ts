import type { UUID } from "node:crypto";
import type { DBInstance } from "@/models/database";
import type { InsertTeam, Team, UpdateTeam } from "@/models/team";

export async function findAll(db: DBInstance): Promise<Team[]> {
	return db.selectFrom("teams").selectAll().execute();
}

export async function findAllNames(db: DBInstance): Promise<string[]> {
	const teams = await db.selectFrom("teams").select("name").execute();
	return teams.map((team) => team.name);
}

export async function findByName(db: DBInstance, name: string): Promise<Team | undefined> {
	return db.selectFrom("teams").selectAll().where("name", "=", name).executeTakeFirst();
}

export async function findById(db: DBInstance, id: UUID): Promise<Team | undefined> {
	return db.selectFrom("teams").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function create(db: DBInstance, team: InsertTeam): Promise<Team> {
	return db.insertInto("teams").values(team).returningAll().executeTakeFirstOrThrow();
}

export async function update(db: DBInstance, id: UUID, update: UpdateTeam): Promise<Team | undefined> {
	return db.updateTable("teams").set(update).where("id", "=", id).returningAll().executeTakeFirst();
}
