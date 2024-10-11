import type { UUID } from "node:crypto";
import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface TicketVendorTable {
	id: Generated<UUID>;
	name: string;
	created_at: Generated<Date>;
	modified_at: ColumnType<Date, string, never>;
}

export type TicketVendor = Selectable<TicketVendorTable>;
export type InsertTicketVendor = Insertable<TicketVendorTable>;
export type UpdateTicketVendor = Updateable<TicketVendorTable>;
