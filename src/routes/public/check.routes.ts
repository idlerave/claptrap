import { Hono } from 'hono';
import type { HonoEnv } from '../../types';
import { insertApp } from '../../db/queries';
import { nanoid } from 'nanoid';
import { health } from '../../actions/health.action';

export const check = new Hono<HonoEnv>();

check.get('/health', (c) => {
	return c.json({ message: 'A chuva é do povo.' }, 200);
});

check.get('/checkup', (c) => {
	const status = health.getStatus();

	if (!status) {
		return c.text('error', 400);
	}

	return c.json(status);
});

check.post('/health/test', async (c) => {
	try {
		const newApp = await insertApp({
			name: 'Test'.concat(nanoid()),
			id: nanoid(),
			endpoint: 'https://www.google.com',
		});
		return c.json(newApp, 201);
	} catch (e) {
		return c.json({ error: e }, 401);
	}
});
