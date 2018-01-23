// Update with your config settings.
const config = require("./config.json");
module.exports = {

  development: {
    client: 'pg',
    connection: {
      database : 'postgres://5.51.141.109/my_man_test',
      user : config.testdatabaseuser,
      password : config.testdatabasepassword
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }

  },

  production: {
    client: 'pg',
    connection: {
      database: 'postgres://5.51.141.109/my_man_production',
      user:     config.productiondatabaseuser,
      password: config.productiondatabasepassword
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/production'
    }
  }

};
