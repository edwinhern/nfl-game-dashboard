import env from "@/env";
import database from "@/lib/database";
import TicketmasterAPI from "@/lib/ticketmaster";
import { SyncController } from "./syncController";
import { SyncService } from "./syncService";

export class SyncContainer {
	private static instance: SyncContainer;
	private services: Map<string, unknown> = new Map();

	private constructor() {
		const tickermasterAPI = new TicketmasterAPI(env.TICKETMASTER_API_KEY);
		const syncService = new SyncService(tickermasterAPI, database);
		const syncController = new SyncController(syncService);

		this.services.set("tickermasterAPI", tickermasterAPI);
		this.services.set("syncService", syncService);
		this.services.set("syncController", syncController);
	}

	static getInstance(): SyncContainer {
		if (!SyncContainer.instance) {
			SyncContainer.instance = new SyncContainer();
		}

		return SyncContainer.instance;
	}

	get<T>(serviceName: string): T {
		const service = this.services.get(serviceName);
		if (!service) {
			throw new Error(`Service ${serviceName} not found`);
		}

		return service as T;
	}
}

export const syncContainer = SyncContainer.getInstance();
