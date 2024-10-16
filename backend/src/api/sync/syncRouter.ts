import { Router } from "express";

import { syncContainer } from "./syncContainer";
import type { SyncController } from "./syncController";

export const createSyncRoutes = (): Router => {
	const router = Router();
	const syncController = syncContainer.get<SyncController>("syncController");

	router.get("/testSync", syncController.testSync.bind(syncController));
	router.get("/nextSync", syncController.getNextSync.bind(syncController));

	return router;
};
