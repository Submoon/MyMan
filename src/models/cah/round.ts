import { EventEmitter } from "events";
import * as _ from "lodash";
import { isNullOrUndefined } from "util";
import { IBlackCard } from "./cahapi";
import ICardChoice from "./ICardChoice";
import Player from "./player";

export default class Round extends EventEmitter {

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

    public get isOver(): boolean {
        return this.choices.length === this.players.length;
    }

    public addPlayedCards(player: Player, cardIndexes: number[]) {
        if (!this.canPlayCards(player, cardIndexes)) {
            throw new Error(`You can't play cards ${cardIndexes.join(", ")}`);
        }
        
        const playedByPlayer: string[] = [];
        // First, we add the cards
        cardIndexes.forEach((index) => {
            const card = player.hand[index];
            playedByPlayer.push(card);
        });

        // Then we delete the cards (Higher first so we don't break indexes)
        cardIndexes = cardIndexes.sort().reverse();
        cardIndexes.forEach((index) => {
            const removedCard = player.hand.splice(index, 1)[0];
            playedByPlayer.push(removedCard);
        });
        this.choices.push({cards: playedByPlayer, player});
        
        if (this.isOver) {
            this.shuffleChoices();
            this.emit("end", this);
        }
        return;
    }

    public canPlayCards(player: Player, cardIndexes: number[]) {
        for (const i of cardIndexes) {
            if (i < 0 || i > player.hand.length) { return false; }
        }
        
        if (cardIndexes.length !== this.blackCard.pick) {
            throw new Error(`Please pick ${this.blackCard.pick} ordered cards for this round`);
        }
        const alreadyPlayed = !isNullOrUndefined(this.choices.find((c) => c.player.id === player.id));
        return !alreadyPlayed;
    }

    private shuffleChoices() {
        this.choices = _.shuffle(this.choices);
    }
}
