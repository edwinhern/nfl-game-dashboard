import dotenv from "dotenv";
import { bool, cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export default cleanEnv(process.env, {
	NODE_ENV: str({
		devDefault: testOnly("test"),
		desc: "The environment the server is running in",
		choices: ["development", "production", "test"],
	}),
	HOST: host({ devDefault: testOnly("localhost"), desc: "The host to start the server on" }),
	PORT: port({ devDefault: testOnly(3000), desc: "The port to start the server on" }),
	DATABASE_URL: str({ devDefault: testOnly(""), desc: "The URL to the database" }),
	TICKETMASTER_API_KEY: str({ devDefault: testOnly(""), desc: "The API key for the Ticketmaster API" }),
	SYNC_SCHEDULE: str({ devDefault: testOnly("0 */12 * * *"), desc: "The cron schedule for syncing games" }),
	DEBUG_MODE: bool({ devDefault: testOnly(false), desc: "Whether to enable debug mode" }),
	REDIS_URL: str({ devDefault: testOnly(""), desc: "The URL to the Redis server" }),
	CACHE_TTL: num({ devDefault: testOnly(3600), desc: "The time-to-live for cache entries in seconds" }),
});
