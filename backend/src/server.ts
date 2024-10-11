import express from "express";

import env from "@/common/config/env";
import logger, { requestLogger } from "@/common/middleware/requestLogger";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.get("/", (_req: express.Request, res: express.Response) => {
	res.json({ status: "API is running on /api" });
});

app.listen(env.PORT, () => {
	const { NODE_ENV, HOST, PORT } = env;
	logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});
