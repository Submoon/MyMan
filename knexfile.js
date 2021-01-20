// Update with your config settings.
// Keep it as JS because it's useless to make it a TS file and it has to be at the root of the project
const Knex = require("knex");
// const config = require("./config.json");

module.exports = {
    development: {
        client: "pg",
        connection: {
            database: "my_man_test",
            host: process.env.DATABASE_HOST,
            password: process.env.DATABASE_PWD,
            port: 5432,
            user: process.env.DATABASE_USER,
        },
        migrations: {
            directory: __dirname + "/migrations",
            tableName: "knex_migrations",
        },
        seeds: {
            directory: __dirname + "/seeds/development",
        },
    },

    production: {
        client: "pg",
        connection: {
            database: "my_man_production",
            host: process.env.DATABASE_HOST,
            password: process.env.DATABASE_PWD,
            port: 5432,
            user: process.env.DATABASE_USER,
        },
        migrations: {
            directory: __dirname + "/migrations",
            tableName: "knex_migrations",
        },
        pool: {
            max: 10,
            min: 2,
        },
        seeds: {
            directory: __dirname + "/seeds/production",
        },
    },
};
