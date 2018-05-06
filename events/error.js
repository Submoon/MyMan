"use strict";
const logger = require('../utils/logger');

module.exports = class ErrorEvent{

    constructor(client, ...args){
        this.client = client;
        this.error = args.shift();
    }
    async run() {
        logger.error(`${this.error.name} : ${this.error.message}`);
    }
}


    