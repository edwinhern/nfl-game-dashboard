import { Redis } from "ioredis";

import env from "@/env";
import { logger } from "@/middleware/logger";

class RedisClient {
	private static instance: Redis;

	private constructor() {}

	public static getInstance(): Redis {
		if (!RedisClient.instance) {
			RedisClient.instance = new Redis(env.REDIS_URL);
			RedisClient.instance.on("error", (error) => logger.error("Redis Client error:", error));
		}

		return RedisClient.instance;
	}
}

export default RedisClient.getInstance();
