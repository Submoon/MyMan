"use strict";


module.exports = class ReadyEvent{

    constructor(client, ...args){
        this.client = client;
    }
    async run() {
        console.log("I am ready!");
    }
}


    