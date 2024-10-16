import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import env from "@/env";
import type { DatabaseTable } from "@/models/database";

class Database {
	private static instance: Kysely<DatabaseTable>;

	private constructor() {}

	public static getInstance(): Kysely<DatabaseTable> {
		if (!Database.instance) {
			const dialect = new PostgresDialect({
				pool: new pg.Pool({
					connectionString: env.DATABASE_URL,
				}),
			});

			Database.instance = new Kysely<DatabaseTable>({ dialect });
		}

		return Database.instance;
	}
}

export default Database.getInstance();
