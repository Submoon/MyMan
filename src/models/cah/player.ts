import { RichEmbed, User } from "discord.js";

import * as cheerio from "cheerio";
import { userInfo } from "os";
import Deck from "./deck";

/**
 * @class Player
 */
export default class Player {

    public hand: string[];

    get id(): string {
        return this.user.id;
    }

    /**
     * @param {User} user The user
     */
    public constructor(public user: User) {
        this.hand = [];
    }

    /**
     * Player draws the specified card
     * @param {string} card The card
     */
    public drawCard(card: string) {
        this.hand.push(card);
    }

    public drawUntilFull(deck: Deck<string>) {
        while (this.hand.length !== 10) {
            this.drawCard(deck.draw());
        }
    }

    /**
     * Displays the user cards as an embed
     * @return {RichEmbed} An embed
     */
    public printCards(): RichEmbed {

        let embed = new RichEmbed()
        .setAuthor(this.user.username, this.user.avatarURL)
        .setColor(0x00AE86)
        .setTitle("Your cards");
        
        const text = "";
        // let turndown = new TurnDown();
        for (let i = 0; i < this.hand.length; i++) {
            const card = this.hand[i];
            const $ = cheerio.load("<div>card</div>");
            if (!$("b").empty()) {
                embed = embed.addField(`${i} : ${$("b").text()}`, $("small").text());
            } else {
                embed = embed.addField(`${i} : ${card}`, card);
            }

            // let markdown = turndown.turndown(card);
            // let cardWithoutdHtml = card.replace(/<[^>]+>/g, '');
            // text += `${i} : ${markdown}\n`;
        }
        // text += "```";
        return embed;
    }

}
