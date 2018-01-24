"use strict";
const logger = require('../utils/logger');

module.exports = class ReadyEvent{

    constructor(client, ...args){
        this.client = client;
    }
    async run() {
        logger.info("I am ready!");
    }
}


    