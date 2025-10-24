import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { databaseUrl } from '../utils';

const pool = new Pool({
	connectionString: databaseUrl(),
	max: 10,
	idleTimeoutMillis: 30000,
});

const db = drizzle(pool, { schema, casing: 'snake_case' });

export { pool, db };
