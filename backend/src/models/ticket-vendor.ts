export interface TicketVendor {
	id: string;
	name: string;
}

export interface NewTicketVendor extends Omit<TicketVendor, "id"> {}
export interface TicketVendorUpdate extends Partial<NewTicketVendor> {}
