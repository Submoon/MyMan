"use strict";
const logger = require("../utils/logger");

module.exports = class PollCommand{

    constructor(client, message, args){
        this.client = client;
        this.message = message;
        this.args = args;
    }

    static get description(){
        return  {
            text:"Creates a poll for {x} seconds",
            usage: "poll {x} {choice1}; {choice2}; {choice3}"
        };
    }


    async run() {

        //Unicode character for :one:, :two:, ...
        const numbers = ["0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];


        let time = Number(this.args.shift());
        //Only nine numbers
        let choices = this.args.join(" ").split(";").slice(0,9);

        let text = "";
        //For each choice, we print it with the emoji associated
        for(let i=0; i<choices.length;i++){
                text += `${numbers[i]} : ${choices[i]}\n`;
        }

        let poll = await this.message.channel.send(text);
        // For each choice we add a possible react
        for(let i=0; i<choices.length; i++){
            await poll.react(`${numbers[i]}`);
        }

        //We don't care about other reacts than the numbers
        const filter = (reaction, user) => numbers.some(n => n ===reaction.emoji.name);

        //We wait time*1000 ms for the reactions
        poll.awaitReactions(filter, {time : time*1000})
        .then(collected => {

            let result = "";
            //For each choice, we get the number of votes
            for(let i=0; i<choices.length; i++){
                let votes = collected.find(c => c.emoji.name === numbers[i]);

                let count = 0;
                //If there was no votes, it's null
                if(votes){
                    count = votes.count-1; //-1 because the bot counts itself
                }
                result+= `${count} votes for the option [${choices[i]}]\n`;
                
            }
            poll.channel.send(result);
        })
        .catch(exception =>{
            logger.error(exception);
            poll.channel.send(exception);
        })

        

    }

}


    