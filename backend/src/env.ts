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
	DATABASE_URL: str({ desc: "The URL to the database" }),
	TICKETMASTER_API_KEY: str({ desc: "The API key for the Ticketmaster API" }),
});
