// TODO: Set proper local db with correct credentials filled in below
const localTestMsSqlConfig = {
    user: 'sa',
    password: 'Softwareplant123',
    server: 'localhost',
    port: '32770',
    database: 'mssql',
    pool: {
        max: process.env.MAX_POOLSIZE || 30,
        min: process.env.MIN_POOLSIZE || 5,
        idleTimeoutMillis: 300 * 1000,
        requestTimeout: 60 * 1000,
        connectionTimeout: 60 * 1000,
    },
    options: {
        encrypt: true,
    },
};

export default localTestMsSqlConfig;
