import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { auth } from '../lib/auth';
import type { app } from '../db/schema';

export type HonoEnv = {
	Variables: {
		user: typeof auth.$Infer.Session.user;
		session: typeof auth.$Infer.Session.session;
	};
};

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export type Task = {
	id: string;
	name: string;
	interval: number;
	action: () => Promise<void>;
	lastRun?: Date;
	status: TaskStatus;
};

export type TaskExecution = {
	taskId: string;
	startTime: Date;
	endTime: Date;
	status: TaskStatus;
	error?: Error;
};

export type App = InferSelectModel<typeof app>;
export type NewApp = InferInsertModel<typeof app>;

export type AppStatus = {
	status: 'unchecked' | 'online' | 'offline';
	lastCheck: Date | undefined;
	error?: string;
};

export type DiscordPayload = {
	embeds: Array<{
		title: string;
		description: string;
		color: number;
		fields: Array<{
			name: string;
			value: string;
			inline: boolean;
		}>;
	}>;
};
