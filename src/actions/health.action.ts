import { DiscordErrorPayload, DiscordPayload } from '../constants';
import { getAllApps } from '../db/queries';
import type { App, AppStatus } from '../types';
import { seconds } from '../utils';
import { Webhook } from '../webhook';

export class Health {
	protected apps: App[];
	protected webhookEndpoint: string;
	protected webhook: Webhook;
	protected history: Map<string, AppStatus & { name: string }>;
	static #instance: Promise<Health>;

	protected constructor() {
		this.apps = [];
		this.webhookEndpoint = process.env.DISCORD_WEBHOOK_ENDPOINT as string;
		this.webhook = new Webhook();

		if (!this.webhookEndpoint) {
			throw new Error("Environment hasn't been properly setup.");
		}

		this.history = new Map();
	}

	private async init(): Promise<void> {
		this.apps = await getAllApps();

		for (const app of this.apps) {
			this.history.set(app.id, {
				name: app.name,
				status: 'unchecked',
				lastCheck: undefined,
			});
		}
	}

	public static async create(): Promise<Health> {
		const instance = new Health();
		await instance.init();
		return instance;
	}

	public static get instance(): Promise<Health> {
		if (!Health.#instance) {
			Health.#instance = Health.create();
		}

		return Health.#instance;
	}

	public async check(): Promise<void> {
		const endpoint = this.webhookEndpoint;

		for (const app of this.apps) {
			try {
				const response = await fetch(app.endpoint);

				if (!response.ok) {
					this.history.set(app.id, {
						name: app.name,
						status: 'offline',
						lastCheck: new Date(),
						error: `HTTP - ${response.status}`,
					});
					this.webhook.send(endpoint, DiscordErrorPayload(app));
				} else {
					this.history.set(app.id, {
						name: app.name,
						status: 'online',
						lastCheck: new Date(),
					});
					this.webhook.send(endpoint, DiscordPayload(app));
				}
			} catch (e: unknown) {
				this.history.set(app.id, {
					name: app.name,
					status: 'offline',
					lastCheck: new Date(),
					error: `ERROR - ${e}`,
				});
				this.webhook.send(endpoint, DiscordErrorPayload(app, e));
			}

			await new Promise((resolve) => setTimeout(resolve, seconds(2)));
		}
	}

	public getStatus() {
		return Object.fromEntries(this.history);
	}

	public getAppStatus(id: string) {
		return this.history.get(id);
	}
}
