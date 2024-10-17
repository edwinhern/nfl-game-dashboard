import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import env from "@/env";
import { logger } from "@/logger";
import type { DatabaseTable } from "@/models/database";

class Database {
	private static instance: Kysely<DatabaseTable>;

	private constructor() {}

	public static getInstance(): Kysely<DatabaseTable> {
		if (!Database.instance) {
			try {
				const dialect = new PostgresDialect({
					pool: new pg.Pool({
						connectionString: env.DATABASE_URL,
					}),
				});

				Database.instance = new Kysely<DatabaseTable>({ dialect });

				logger.info("Database instance created successfully");
			} catch (error) {
				logger.error("Error creating database instance:", error);
			}
		}

		return Database.instance;
	}
}

export default Database.getInstance();
