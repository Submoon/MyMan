// Update with your config settings.
import * as Knex from "knex";
import config = require("../config.json");

export default {

    development: {
        client: "pg",
        connection: {
            database : "my_man_test",
            host: "5.51.141.109",
            password : config.testdatabasepassword,
            port: 5432,
            user : config.testdatabaseuser,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
            tableName: "knex_migrations",
        },
        seeds: {
            directory: __dirname + "/db/seeds/development",
        },

    } as Knex.Config,

    production: {
        client: "pg",
        connection: {
            database: "my_man_production",
            host: "5.51.141.109",
            password: config.productiondatabasepassword,
            port: 5432,
            user:     config.productiondatabaseuser,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
            tableName: "knex_migrations",
        },
        pool: {
            max: 10,
            min: 2,
        },
        seeds: {
            directory: __dirname + "/db/seeds/production",
        },
    } as Knex.Config,

};
