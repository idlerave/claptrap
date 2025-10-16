export class Webhook {
	public async send(endpoint: string, payload: unknown): Promise<void> {
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
