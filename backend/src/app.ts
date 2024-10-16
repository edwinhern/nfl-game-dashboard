import express from "express";
import cron from "node-cron";

import { createGameRoutes } from "@/api/game";
import { type SyncController, createSyncRoutes, syncContainer } from "@/api/sync";
import env from "@/env";
import { logger, requestLogger } from "@/logger";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use("/api/sync", createSyncRoutes());
app.use("/api/games", createGameRoutes());

// Cron job to sync data
cron.schedule(env.SYNC_SCHEDULE, async () => {
	const syncController = syncContainer.get<SyncController>("syncController");
	syncController.scheduledSync().catch((error) => {
		logger.error("Error in scheduled sync:", error);
	});
});

app.listen(env.PORT, () => {
	logger.info(`Server (${env.NODE_ENV}) running on port http://${env.HOST}:${env.PORT}`);
});
