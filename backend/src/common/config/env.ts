import dotenv from "dotenv";
import { cleanEnv, host, num, port, str } from "envalid";

dotenv.config();

export default cleanEnv(process.env, {
	NODE_ENV: str({
		desc: "The environment the server is running in",
		choices: ["development", "production", "test"],
	}),
	HOST: host({ desc: "The host to start the server on" }),
	PORT: port({ desc: "The port to start the server on" }),
	CORS_ORIGIN: str({ desc: "The origin to allow CORS requests from" }),
	COMMON_RATE_LIMIT_MAX_REQUESTS: num({
		desc: "The maximum number of requests allowed in the rate limit window",
	}),
	COMMON_RATE_LIMIT_WINDOW_MS: num({
		desc: "The window in milliseconds for the rate limit",
	}),
});
