import { db } from '.';
import { app } from './schema';
import type { App, NewApp } from '../types';

export async function getAllApps(): Promise<App[]> {
	return await db.select().from(app);
}

export async function insertApp(a: NewApp): Promise<App> {
	const [result] = await db.insert(app).values(a).returning();

	return result;
}
