
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('autoanswers', function(table){
            table.increments('id').primary()
            table.string('userId');
            table.string('serverId');
            table.string('autoanswer');
            table.timestamps();
            table.unique(['userId', 'serverId']);
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('autoanswers')
      ])
};
