import { db } from '.';
import { app } from './schema';
import type { App, NewApp } from '../types';
import { eq } from 'drizzle-orm';

export async function getAllApps(): Promise<App[]> {
	return await db.select().from(app);
}

export async function getAppFromId(id: string): Promise<App[] | null> {
	const result = await db.select().from(app).where(eq(app.id, id));

	if (!result) {
		console.error('Could not find the app with the ID:', id);
		return null;
	}

	return result;
}

export async function insertApp(a: NewApp): Promise<App> {
	const [result] = await db.insert(app).values(a).returning();

	return result;
}
