import cronParser from "cron-parser";
import type { Request, Response } from "express";

import type { SyncService } from "@/api/sync/syncService";
import env from "@/env";
import { logger } from "@/logger";

export class SyncController {
	private syncService: SyncService;

	constructor(syncService: SyncService) {
		this.syncService = syncService;
	}

	async testSync(_req: Request, res: Response) {
		logger.info("Manual sync triggered");

		try {
			await this.syncService.syncGames();
			res.json({ status: "Manual sync completed" });
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(500).json({ status: "Manual sync failed", error: error.message });
			} else {
				res.status(500).json({ status: "Manual sync failed" });
			}
		}
	}

	getNextSync(_req: Request, res: Response): void {
		try {
			const interval = cronParser.parseExpression(env.SYNC_SCHEDULE);
			const nextRun = interval.next().toDate();
			res.json({ nextSync: nextRun });
		} catch (error) {
			logger.error("Error parsing cron expression:", error);
			res.status(500).json({ error: "Failed to determine next sync time" });
		}
	}

	async scheduledSync(): Promise<void> {
		logger.info("Starting scheduled game sync");
		try {
			await this.syncService.syncGames();
			logger.info("Scheduled sync completed");
		} catch (error) {
			logger.error("Scheduled sync failed:", error);
		}
	}
}
