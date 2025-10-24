import { auth } from '../lib/auth';
import type { HonoEnv } from '../types';
import { createMiddleware } from 'hono/factory';

export const adminMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	const userRole = session?.user.role;

	if (!session || userRole !== 'admin') {
		return c.json({ error: 'Unauthorized' }, 401);
	}

	c.set('user', session.user);
	c.set('session', session.session);

	return next();
});
