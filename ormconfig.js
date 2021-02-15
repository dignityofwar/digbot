const settings = {
    entities: [
        `${__dirname}/dist/**/*.entity.js`,
    ],
    synchronize: true,
    // migrationsRun: true,
};

module.exports = ((connection) => {
    switch (connection) {
        case 'sqlite':
            return {
                type: 'sqlite',
                database: process.env.DB_DATABASE || './storage/db.sqlite',
                ...settings
            }
        case 'mariadb':
            return {
                type: 'mariadb',
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || '3306',
                database: process.env.DB_DATABASE || 'digbot',
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                ...settings
            }
        default:
            throw new Error(`Database connection "${connection}" not recognized`);
    }
})(process.env.DB_CONNECTION);
