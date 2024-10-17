import type { UUID } from "node:crypto";
import type { DBInstance } from "@/models/database";
import type { InsertTicketVendor, TicketVendor, UpdateTicketVendor } from "@/models/entities/ticketVendor";

export async function findAll(db: DBInstance): Promise<TicketVendor[]> {
	return db.selectFrom("ticket_vendors").selectAll().execute();
}

export async function findAllNames(db: DBInstance): Promise<string[]> {
	const vendors = await db.selectFrom("ticket_vendors").select("name").execute();
	return vendors.map((vendor) => vendor.name);
}

export async function findByName(db: DBInstance, name: string): Promise<TicketVendor | undefined> {
	return db.selectFrom("ticket_vendors").selectAll().where("name", "=", name).executeTakeFirst();
}

export async function findById(db: DBInstance, id: UUID): Promise<TicketVendor | undefined> {
	return db.selectFrom("ticket_vendors").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function create(db: DBInstance, ticketVendor: InsertTicketVendor): Promise<TicketVendor> {
	return db.insertInto("ticket_vendors").values(ticketVendor).returningAll().executeTakeFirstOrThrow();
}

export async function update(db: DBInstance, id: UUID, update: UpdateTicketVendor): Promise<TicketVendor | undefined> {
	return db.updateTable("ticket_vendors").set(update).where("id", "=", id).returningAll().executeTakeFirst();
}
