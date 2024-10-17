import type { Request, Response } from "express";

import type { SyncService } from "@/api/sync/syncService";

export class SyncController {
	private syncService: SyncService;

	constructor(syncService: SyncService) {
		this.syncService = syncService;
	}

	async testSync(_req: Request, res: Response) {
		const result = await this.syncService.syncGames();
		res.status(result.statusCode).json(result);
	}

	async getNextSync(_req: Request, res: Response): Promise<void> {
		const result = await this.syncService.getNextSyncTime();
		res.status(result.statusCode).json(result);
	}

	async scheduledSync(): Promise<void> {
		await this.syncService.syncGames();
	}
}
