import { EventEmitter } from "events";
import * as _ from "lodash";
import { isNullOrUndefined } from "util";
import { IBlackCard } from "./cahapi";
import ICardsPlayed from "./ICardsPlayed";
import Player from "./player";

export default class Round extends EventEmitter {

    public cardsPlayed: ICardsPlayed[];

    constructor(
        public readonly cardCzar: Player,
        public readonly blackCard: IBlackCard,
        public readonly players: Player[],
    ) {
        super();
        // Initializes cardsPlayed to 0 cards played for every playing player
        this.cardsPlayed = [];
    }

    public addPlayedCards(player: Player, cardIndexes: number[]) {
        if (!this.canPlayCards(player, cardIndexes)) {
            return;
        }
        
        const playedByPlayer: string[] = [];
        cardIndexes.forEach((index) => {
            const removedCard = player.hand.splice(index, 1)[0];
            playedByPlayer.push(removedCard);
        });
        this.cardsPlayed.push({cards: playedByPlayer, player});
        
        if (this.isOver) {
            this.shuffleCards();
            this.emit("end", this);
        }
    }

    public canPlayCards(player: Player, cardIndexes: number[]) {
        if (cardIndexes.length !== this.blackCard.pick) {
            throw new Error(`Please pick ${this.blackCard.pick} ordered cards for this round`);
        }
        const alreadyPlayed = !isNullOrUndefined(this.cardsPlayed.find((c) => c.player.id === player.id));
        return !alreadyPlayed;
    }

    public get isOver(): boolean {
        return this.cardsPlayed.length === this.players.length;
    }

    private shuffleCards() {
        this.cardsPlayed = _.shuffle(this.cardsPlayed);
     }
}
