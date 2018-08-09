"use strict";
const moment = require('moment');
const logger = require("../utils/logger");

module.exports = class RenameHistoryCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Gets the last changes in the nickname of a user",
            usage: "lastrenamed"
        };
    }

    async run() {
        let user = this.message.mentions.members.first();

        let auditLogs = await this.message.guild.fetchAuditLogs({
            type: 24
        });

        let entries = auditLogs.entries.filter(log => log.target.id === user.id)
        .filter(log => log.changes.some(c => c.key === "nick"));
        let array = entries.array().slice(0,10);
        let text = "";
        array.forEach(log => {
            let change = log.changes.find(c => c.key === "nick");
            let date = moment(log.createdAt).format("DD/MM/YYYY:HH[h]mm");

            text += `${date}        [ ${change.old} => ${change.new}]       ${log.reason ?log.reason : "No reason provided" }\n`;

        });

        this.message.channel.send(text);
    }
}


    