import { Message, RichEmbed, User } from "discord.js";

import * as cheerio from "cheerio";
import { userInfo } from "os";
import logger from "../../utils/logger";
import Deck from "./deck";

/**
 * @class Player
 */
export default class Player {

    /**
     * Cards in the hand of the player
     */
    public hand: string[];

    /**
     * Returns the user id associated to the player
     */
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

    /**
     * Draws until the player has 10 cards from the specified deck
     * @param {Deck<string>} deck The deck to draw from
     */
    public drawUntilFull(deck: Deck<string>) {
        logger.debug(`Player ${this} drawing until full`);
        while (this.hand.length !== 10) {
            this.drawCard(deck.draw());
        }
    }

    /**
     * Displays the user cards as message
     * @return {string} The text for a message
     */
    public printCards(roundMessage: Message): string {

        // let embed = new RichEmbed()
        // .setAuthor(this.user.username, this.user.avatarURL)
        // .setColor(0x00AE86)
        // .setTitle("Your cards");
        // // embe = embed.addField("Link", roundMessage.link);
        // // const text = "";
        // // let turndown = new TurnDown();
        // for (let i = 0; i < this.hand.length; i++) {
        //     const card = this.hand[i];
        //     const $ = cheerio.load("<div>card</div>");
        //     if (!$("b").empty()) {
        //         embed = embed.addField(`${i} : ${$("b").text()}`, $("small").text());
        //     } else {
        //         embed = embed.addField(`${i} : ${card}`, card);
        //     }

        //     // let markdown = turndown.turndown(card);
        //     // let cardWithoutdHtml = card.replace(/<[^>]+>/g, '');
        //     // text += `${i} : ${markdown}\n`;
        // }

        const lines: string[] = [];
        lines.push("Your cards");
        lines.push(`Message: ${roundMessage.url}`);
        this.hand.forEach((card, i) => {
            lines.push(`${i} : ${card}`);
        });

        // text += "```";
        return lines.join("\n");
    }

    public toString(): string {
        return this.user.toString();
    }

}
