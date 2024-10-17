import type { UUID } from "node:crypto";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface TicketVendorTable {
	id: Generated<UUID>;
	name: string;
}

export type TicketVendor = Selectable<TicketVendorTable>;
export type InsertTicketVendor = Insertable<TicketVendorTable>;
export type UpdateTicketVendor = Updateable<TicketVendorTable>;
