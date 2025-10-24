import type { Task, TaskExecution } from '../types';
import chalk from 'chalk';
import { nanoid } from 'nanoid';

export class Scheduler {
	protected tasks: Map<string, Task>;
	protected timers: Map<string, NodeJS.Timeout>;

	constructor() {
		this.tasks = new Map();
		this.timers = new Map();
	}

	public addTask(task: Omit<Task, 'id' | 'status'>): string {
		const id = this.generateId();

		const newTask: Task = {
			...task,
			id,
			status: 'pending',
		};

		this.tasks.set(id, newTask);

		this.scheduleTask(newTask);

		return id;
	}

	protected async executeTask(task: Task): Promise<void> {
		task.status = 'running';
		task.lastRun = new Date();

		const execution: Partial<TaskExecution> = {
			taskId: task.id,
			startTime: new Date(),
			status: 'running',
		};

		console.log(chalk.yellow(`RUNNING - ${task.name}\nID: ${task.id}`));

		try {
			await task.action();
			task.status = 'completed';
			execution.status = 'completed';

			console.log(chalk.green(`COMPLETED - ${task.name}\nID: ${task.id}`));
		} catch (e) {
			task.status = 'failed';
			execution.status = 'failed';
			execution.error = e as Error;

			console.log(
				chalk.red(`ERROR - ${task.name}\nID: ${task.id}\n${execution.error}`),
			);
		}
	}

	protected scheduleTask(task: Task) {
		if (!task.lastRun) {
			this.executeTask(task);
		}

		const timer = setInterval(() => {
			this.executeTask(task);
		}, task.interval);

		this.timers.set(task.id, timer);
	}

	private generateId(): string {
		return nanoid();
	}
}
