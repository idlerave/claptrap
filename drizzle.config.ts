import { defineConfig } from 'drizzle-kit';
import { databaseUrl } from './src/utils';

export default defineConfig({
	out: './src/db/migrations',
	schema: './src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: databaseUrl(),
	},
	casing: 'snake_case',
});
