// Update with your config settings.
// Keep it as JS because it's useless to make it a TS file and it has to be at the root of the project
import * as Knex from "knex";
const config = require("./config.json");

export default {

    development: {
        client: "pg",
        connection: {
            database : "my_man_test",
            host: config.host,
            password : config.testdatabasepassword,
            port: 5432,
            user : config.testdatabaseuser,
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
            host: config.host,
            password: config.productiondatabasepassword,
            port: 5432,
            user:     config.productiondatabaseuser,
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
