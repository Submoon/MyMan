import { EventEmitter } from "events";
import * as _ from "lodash";
import { isNullOrUndefined } from "util";
import logger from "../../utils/logger";
import { IBlackCard } from "./cahapi";
import ICardChoice from "./ICardChoice";
import Player from "./player";

export default class Round extends EventEmitter {

    /**
     * Cards played by each player
     */
    public choices: ICardChoice[];

    constructor(
        public readonly cardCzar: Player,
        public readonly blackCard: IBlackCard,
        public readonly players: Player[],
    ) {
        super();
        // Initializes cardsPlayed to 0 cards played for every playing player
        this.choices = [];
    }

    /**
     * Returns true if the round is over (Everyone played)
     */
    public get isOver(): boolean {
        return this.choices.length === this.players.length;
    }

    /**
     * Adds the specified cards to the specified user played cards for this round
     * @param {Player} player the player
     * @param {number[]} cardIndexes the played cards indexes
     */
    public addPlayedCards(player: Player, cardIndexes: number[]) {
        if (!this.canPlayCards(player, cardIndexes)) {
            throw new Error(`You can't play cards ${cardIndexes.join(", ")}`);
        }
              
        const playedByPlayer: string[] = [];
        logger.info(`Retrieving cards ${cardIndexes.join()} for player ${player}`);
        // First, we add the cards
        cardIndexes.forEach((index) => {
            const card = player.hand[index];
            logger.debug(`Found card ${card} at index ${index}`);
            playedByPlayer.push(card);
        });

        // Then we delete the cards (Higher first so we don't break indexes)
        cardIndexes = cardIndexes.sort().reverse();
        cardIndexes.forEach((index) => {
            const removedCard = player.hand.splice(index, 1)[0];
            logger.info(`Removed card ${removedCard} at index ${index} from user's hand`);
        });

        logger.info(`Added cards ${playedByPlayer.join(", ")} for players ${player}`);
        this.choices.push({cards: playedByPlayer, player});
        
        if (this.isOver) {
            logger.info("Every player made a choice");
            this.shuffleChoices();
            logger.info("Sending end event");
            this.emit("end", this);
        }
        return;
    }

    /**
     * Checks if the specified user can play the specified cards
     * @param {Player} player the player
     * @param {number[]} cardIndexes the card indexes
     */
    public canPlayCards(player: Player, cardIndexes: number[]) {
        for (const i of cardIndexes) {
            if (i < 0 || i >= player.hand.length || isNaN(i) || i == null) {
                logger.error(`Card index ${i} is not a valid pick`);
                return false;
            }
        }
        
        if (cardIndexes.length !== this.blackCard.pick) {
            logger.error(`Player ${player} played ${cardIndexes.length} cards instead of ${this.blackCard.pick}`);
            throw new Error(`Please pick ${this.blackCard.pick} ordered cards for this round`);
        }
        const alreadyPlayed = !(this.choices.find((c) => c.player.id === player.id) == null);
        return !alreadyPlayed;
    }

    public toString(): string {
        return `czar: ${this.cardCzar}, blackCard: ${this.blackCard.text}, players: ${this.players.join()}`;
    }

    /**
     * Shuffles the choices so players can't know which choice belongs to whom
     */
    private shuffleChoices() {
        logger.info("Shuffling choices");
        this.choices = _.shuffle(this.choices);
    }
}
