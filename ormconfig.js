// eslint-disable-next-line @typescript-eslint/no-var-requires
// require('dotenv').config();

module.exports = {
    type: 'sqlite',
    database: process.env.DB_DATABASE || './storage/db.sqlite',
    entities: [
        __dirname + '/dist/**/*.entity.js',
    ],
    synchronize: true,
    // migrationsRun: true,
};
