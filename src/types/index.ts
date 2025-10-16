export type TaskStatus = "pending" | "running" | "completed" | "failed";

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

export type App = {
	name: string;
	endpoint: string;
};

export type Payload = {
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
