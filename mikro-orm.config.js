const {TsMorphMetadataProvider} = require('@mikro-orm/reflection');

module.exports = {
    type: 'mariadb',
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'diglet',
    password: process.env.DB_PASS || 'pass',
    dbName: process.env.DB_NAME || 'digbot',

    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',

    migrations: {
        tableName: '__migrations',
        path: './migrations',
        pattern: /^[\w-]+\d+\.js$/,
        emit: 'js',
    },

    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    metadataProvider: TsMorphMetadataProvider,
};