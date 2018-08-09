"use strict";
const logger = require('../utils/logger');

module.exports = class ErrorEvent{

    constructor(client, ...args){
        this.client = client;
        this.warning = args.shift();
    }
    
    async run() {
        logger.warn(`${this.warning}`);
    }
}


    