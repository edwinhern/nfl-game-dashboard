import cronParser from "cron-parser";
import express from "express";
import cron from "node-cron";

import env from "@/env";
import { logger, requestLogger } from "@/logger";
import TicketmasterAPI from "./lib/ticketmaster/";
import { DataSyncService } from "./services/dataSyncService";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes

app.get("/test-sync", async (_req: express.Request, res: express.Response) => {
	logger.info("Manual sync triggered");
	const dataSyncService = new DataSyncService();
	await dataSyncService.syncGames();

	res.json({ status: "Manual sync completed" });
});

app.get("/next-sync", (_req: express.Request, res: express.Response) => {
	const interval = cronParser.parseExpression(env.SYNC_SCHEDULE);
	const nextRun = interval.next().toDate();
	res.json({ nextSync: nextRun });
});

cron.schedule(env.SYNC_SCHEDULE, async () => {
	logger.info("Starting scheduled game sync");

	const dataSyncService = new DataSyncService();
	await dataSyncService.syncGames().catch((error) => {
		logger.error("Scheduled sync failed:", error);
	});

	logger.info("Scheduled sync completed");
});

app.listen(env.PORT, () => {
	const { NODE_ENV, HOST, PORT } = env;
	logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});
