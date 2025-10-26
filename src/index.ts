import { Hono } from 'hono';
import { Scheduler } from './tasks';
import { seconds } from './utils';
import { Health } from './actions/health.action';
import { cors } from 'hono/cors';
import { check } from './routes/public/check.routes';

class Claptrap {
	public app: Hono;
	public health: Promise<Health>;
	protected scheduler: Scheduler;

	constructor() {
		this.app = new Hono();
		this.scheduler = new Scheduler();
		this.health = Health.instance;
	}

	public static async create(): Promise<Claptrap> {
		const instance = new Claptrap();
		await instance.init();
		return instance;
	}

	private async init(): Promise<void> {
		const health = await this.health;

		// Tasks
		this.scheduler.addTask({
			name: 'Health Checkup',
			interval: seconds(60),
			action: async () => await health.check(),
		});

		// Setting up the API
		this.app.use('/*', cors());
		this.app.route('/', check);
	}
}

const ct = await Claptrap.create();

export default {
	port: 3001,
	fetch: ct.app.fetch,
};
