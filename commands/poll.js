"use strict";

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

        const numbers = ["0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
        // const emojis = numbers.map(n => this.message.guild.emojis.find("name", n));
        // console.log(this.clientemojis);

        let time = Number(this.args.shift());
        //Only nine numbers
        let choices = this.args.join(" ").split(";").slice(0,9);

        let text = "";
        for(let i=0; i<choices.length;i++){
                text += `${numbers[i]} : ${choices[i]}\n`;
        }

        let message = await this.message.channel.send(text);
        for(let i=0; i<choices.length; i++){
            await message.react(`${numbers[i]}`);
        }

        const filter = (reaction, user) => numbers.some(n => n ===reaction.emoji.name);
        // let filter = (reaction, user) => true;
        message.awaitReactions(filter, {time : time*1000})
        .then(collected => {
            // console.log(collected);
            let result = "";
            for(let i=0; i<choices.length; i++){
                let votes = collected.find(c => c.emoji.name === numbers[i]);
                // console.log(votes);
                let count = 0;
                if(votes){
                    count = votes.count-1;
                }
                result+= `${count} votes for the option [${choices[i]}]\n`;
                
            }
            message.channel.send(result);
        })
        .catch(exception =>{
            console.error(exception);
        })

        

    }

}


    