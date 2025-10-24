import type { App, DiscordPayload as Payload } from '../types';

export const Color = {
	SUCCESS: 0x00ff00,
	ERROR: 0xff0000,
};

export const DiscordPayload = (app: App): Payload => {
	return {
		embeds: [
			{
				title: `Notification - ${app.name}`,
				description: 'The endpoint is ok.',
				color: Color.SUCCESS,
				fields: [
					{ name: 'Status', value: 'Online', inline: true },
					{
						name: 'Time',
						value: new Date().toISOString(),
						inline: true,
					},
				],
			},
		],
	};
};

export const DiscordErrorPayload = (app: App, error?: unknown): Payload => {
	return {
		embeds: [
			{
				title: `Notification - ${app.name}`,
				description: `The endpoint is offline.\n${error}`,
				color: Color.ERROR,
				fields: [
					{ name: 'Status', value: 'Offline', inline: true },
					{
						name: 'Time',
						value: new Date().toISOString(),
						inline: true,
					},
				],
			},
		],
	};
};
