import { Message, RichEmbed, User } from "discord.js";
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
     * Player's points for this game
     */
    private _points: number;

    /**
     * Returns the user id associated to the player
     */
    get id(): string {
        return this.user.id;
    }

    /**
     * Returns the player's points
     */
    get points() {
        return this._points;
    }

    /**
     * @param {User} user The user
     */
    public constructor(public user: User) {
        this.hand = [];
        this._points = 0;
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
        const lines: string[] = [];
        lines.push("Your cards");
        lines.push(`Message: ${roundMessage.url}`);
        this.hand.forEach((card, i) => {
            lines.push(`${i} : ${card}`);
        });

        // text += "```";
        return lines.join("\n");
    }

    /**
     * Player earns one point
     * @returns {number} the number of points
     */
    public earnPoint(): number {
        return ++this._points;
    }

    public toString(): string {
        return this.user.toString();
    }
}
