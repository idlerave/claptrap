import { Apps, DiscordErrorPayload, DiscordPayload } from "../constants";
import type { App } from "../types";
import { seconds } from "../utils";
import { Webhook } from "../webhook";
export class Health {
	protected apps: App[];
	protected webhookEndpoint: string;
	protected webhook: Webhook;

	constructor() {
		this.apps = Apps;
		this.webhookEndpoint = process.env.DISCORD_WEBHOOK_ENDPOINT as string;
		this.webhook = new Webhook();
		if (!this.webhookEndpoint) {
			throw new Error("Environment hasn't been properly setup.");
		}
	}
	public async check(): Promise<void> {
		const endpoint = this.webhookEndpoint;

		for (const app of this.apps) {
			try {
				const response = await fetch(app.endpoint);
				if (!response.ok) {
					this.webhook.send(endpoint, DiscordErrorPayload(app));
				}
				this.webhook.send(endpoint, DiscordPayload(app));
			} catch (e: unknown) {
				this.webhook.send(endpoint, DiscordErrorPayload(app, e));
			}
			await new Promise((resolve) => setTimeout(resolve, seconds(2)));
		}
	}
}
