import dotenv from "dotenv";
import { Hono } from "hono";
import { Scheduler } from "./task";
import { seconds } from "./utils";
import { Health } from "./actions/health";

dotenv.config({
	path: ".env",
});

const app = new Hono();
const scheduler = new Scheduler();
const health = new Health();

const task = () =>
	scheduler.addTask({
		name: "Health Checkup",
		interval: seconds(10),
		action: () => health.check(),
	});

task();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;
