import _ from "lodash";

import { STATUS_MAP } from "@/lib/ticketmaster/constants";
import type { ParsedEvent, TicketmasterEvent, TicketmasterSale } from "@/lib/ticketmaster/types";
import type { GameStatus } from "@/models/entities/game";

export function parseEvents(events: TicketmasterEvent[]): ParsedEvent[] {
	return _.map(events, parseEvent);
}

export function parseEvent(event: TicketmasterEvent): ParsedEvent {
	const { id, name, dates, priceRanges, _embedded, sales } = event;
	const { start, end, status } = dates;
	return {
		id,
		name,
		start_date: new Date(start.dateTime),
		end_date: end?.dateTime ? new Date(end.dateTime) : calculateEndDate(start.dateTime),
		status: mapStatus(status.code),
		min_price: _.get(priceRanges, "[0].min"),
		max_price: _.get(priceRanges, "[0].max"),
		stadium_id: _.get(_embedded, "venues[0].id"),
		stadium_name: _.get(_embedded, "venues[0].name"),
		team_names: _.map(_embedded?.attractions, "name"),
		team_ids: _.map(_embedded?.attractions, "id"),
		presale_date: parseDateOrNull(getEarliestDate(sales)),
		onsale_date: parseDateOrNull(_.get(sales, "public.startDateTime")),
		offsale_date: parseDateOrNull(_.get(sales, "public.endDateTime")),
	};
}

function getEarliestDate(salesObject?: TicketmasterSale): string | null {
	const preSales = _.get(salesObject, "presales", []);
	if (_.isEmpty(preSales)) return null;
	return _.minBy(preSales, "startDateTime")?.startDateTime ?? null;
}

function calculateEndDate(startDate: string): Date {
	return _.tap(new Date(startDate), (date) => date.setHours(date.getHours() + 4));
}

function mapStatus(statusCode: string): GameStatus {
	return _.get(STATUS_MAP, statusCode.toLowerCase(), "inactive");
}

function parseDateOrNull(dateString: string | null | undefined): Date | null {
	return _.isNil(dateString) ? null : new Date(dateString);
}

export function formatDate(date?: Date | string): string | undefined {
	if (!date) return undefined;
	const d = typeof date === "string" ? new Date(date) : date;
	return `${d.toISOString().slice(0, 19)}Z`;
}
