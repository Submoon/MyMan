"use strict";
const logger = require('../utils/logger');

module.exports = class ReadyEvent{

    constructor(client, ...args){
        this.client = client;
    }
    async run() {
        logger.info(`Bot started in ${process.env.NODE_ENV} mode !`);
        this.updateUsers(this.client);
        this.client.setInterval(this.updateUsers, 60000, this.client);
    }

    async updateUsers(client) {
        let users = client.users.filterArray(u => !u.bot);
        let nbOfUsers = users.length;
            
        await client.user.setActivity(`${nbOfUsers} users sleep`, {type: 'WATCHING'});
    }
}


    