function seconds(sec: number) {
	return sec * 1000;
}

const databaseUrl = (): string => {
	const env = process.env.DATABASE_URL;

	if (!env) {
		throw new Error('Environment has not been properly setup.');
	}

	return env;
};

export { seconds, databaseUrl };
