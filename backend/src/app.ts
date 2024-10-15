import express from "express";

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
app.get("/", async (_req: express.Request, res: express.Response) => {
	const api = new TicketmasterAPI(env.TICKETMASTER_API_KEY);

	try {
		const oneMonthFromNow = new Date();
		oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

		const events = await api.getNFLEvents({
			startDateTime: new Date(),
			endDateTime: oneMonthFromNow,
			size: "5",
		});

		res.json({
			status: "API is running on /api",
			eventCount: events.length,
			firstEventName: events[0]?.name || "No events found",
			events,
		});
	} catch (error) {
		logger.error("Error fetching events:", error);
		res.status(500).json({
			status: "Error",
			message: error instanceof Error ? error.message : "An unknown error occurred",
		});
	}
});

app.get("/sync", async (_req: express.Request, res: express.Response) => {
	const dataSyncService = new DataSyncService();
	await dataSyncService.syncGames();

	res.json({ status: "Syncing games" });
});

app.listen(env.PORT, () => {
	const { NODE_ENV, HOST, PORT } = env;
	logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});
