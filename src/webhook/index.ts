import { config } from "../config";

export class Webhook {
	public async send(endpoint: string, payload: unknown): Promise<void> {
		if (config.features.webhook) {
			try {
				await fetch(endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});
			} catch (e) {
				console.log(e);
			}
		}
	}
}
