
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function(table){
            table.string('id').primary();
            table.string('username');
            table.timestamps();
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users')
      ])
};
