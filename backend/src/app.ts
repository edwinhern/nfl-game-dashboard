import express from "express";

import db from "@/config/database";
import env from "@/config/env";
import { logger, requestLogger } from "@/logger";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.get("/", async (_req: express.Request, res: express.Response) => {
	const vendors = await db.selectFrom("ticket_vendors").selectAll().execute();
	res.json({ status: "API is running on /api", response: vendors });
});

app.listen(env.PORT, () => {
	const { NODE_ENV, HOST, PORT } = env;
	logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});
