import { Hono } from 'hono';
import type { HonoEnv } from '../../types';
import { adminMiddleware } from '../../middlewares/admin.middleware';

const check = new Hono<HonoEnv>();

check.use(adminMiddleware);


