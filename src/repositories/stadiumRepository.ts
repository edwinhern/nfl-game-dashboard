import type { UUID } from "node:crypto";
import type { DBInstance } from "@/models/database";
import type { InsertStadium, Stadium, UpdateStadium } from "@/models/entities/stadium";

export async function findAll(db: DBInstance): Promise<Stadium[]> {
	return db.selectFrom("stadiums").selectAll().execute();
}

export async function findAllNames(db: DBInstance): Promise<string[]> {
	const stadiums = await db.selectFrom("stadiums").select("name").execute();
	return stadiums.map((stadium) => stadium.name);
}

export async function findByName(db: DBInstance, name: string): Promise<Stadium | undefined> {
	return db.selectFrom("stadiums").selectAll().where("name", "=", name).executeTakeFirst();
}

export async function findById(db: DBInstance, id: UUID): Promise<Stadium | undefined> {
	return db.selectFrom("stadiums").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function create(db: DBInstance, stadium: InsertStadium): Promise<Stadium> {
	return db.insertInto("stadiums").values(stadium).returningAll().executeTakeFirstOrThrow();
}

export async function update(db: DBInstance, id: UUID, update: UpdateStadium): Promise<Stadium | undefined> {
	return db.updateTable("stadiums").set(update).where("id", "=", id).returningAll().executeTakeFirst();
}
