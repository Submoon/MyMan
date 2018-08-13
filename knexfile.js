// Update with your config settings.
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
            directory: __dirname + "src/db/migrations",
            tableName: "knex_migrations",
        },
        seeds: {
            directory: __dirname + "src/db/seeds/development",
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
            directory: __dirname + "src/db/migrations",
            tableName: "knex_migrations",
        },
        pool: {
            max: 10,
            min: 2,
        },
        seeds: {
            directory: __dirname + "src/db/seeds/production",
        },
    },

};
