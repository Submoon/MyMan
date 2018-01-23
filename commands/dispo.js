"use strict";
const dispo = require("./model/auto").list;

module.exports = class DispoCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Sets the user's available status.",
            usage: "dispo {0 or 1}"
        };
    }

    async run() {
        const avail = Number(this.args[0]);
        let author = this.message.author;
        
        // Control of the disponibility's value.
        if(avail === 1 || avail === 0){
            // Control of redundant cases.
            if(dispo.get(author) === avail){
                this.message.channel.send("Vous avez déjà le statut **" + (avail === 1 ? "disponible" : "indisponible") + "**.")
            }else{
                this.message.channel.send("La disponibilité a été modifiée. Vous êtes maintenant **" + (avail === 1 ? "disponible" : "indisponible") + "**." );
                dispo.set(author, avail);
            }
        }else{
            this.message.channel.send("La disponibilité n'a pas été reconnue.");
        }
    }
}