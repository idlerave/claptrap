import dotenv from 'dotenv';
import { Hono } from 'hono';
import { Scheduler } from './tasks';
import { seconds } from './utils';
import { health, Health } from './actions/health.action';
import { cors } from 'hono/cors';
import { check } from './routes/public/check.routes';

dotenv.config({
	path: '.env',
});

class Claptrap {
	public app: Hono;
	public health: Health = new Health();
	protected scheduler: Scheduler;

	constructor() {
		this.app = new Hono();
		this.scheduler = new Scheduler();
	}

	public static async create(): Promise<Claptrap> {
		const instance = new Claptrap();
		await instance.init();
		return instance;
	}

	private async init(): Promise<void> {
		this.health = health;

		this.scheduler.addTask({
			name: 'Health Checkup',
			interval: seconds(60),
			action: async () => await this.health.check(),
		});

		this.app.use('/*', cors());
		this.app.route('/', check);
	}
}
const ct = await Claptrap.create();

export default {
	port: 3001,
	fetch: ct.app.fetch,
};
