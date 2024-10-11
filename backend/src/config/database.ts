import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import env from "@/config/env";
import type { Database } from "@/types/database";

const dialect = new PostgresDialect({
	pool: new pg.Pool({
		connectionString: env.DATABASE_URL,
	}),
});

const database = new Kysely<Database>({ dialect });

export default database;
