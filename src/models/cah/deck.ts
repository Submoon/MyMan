import * as _ from "lodash";

export default class Deck<T> {
    private cards: T[];
    private played: T[];

    /**
     * Creates a new deck from a set of cards
     * @param nonShuffledCards Non shuffled cards
     */
    public constructor(nonShuffledCards: T[]) {
        this.cards = _.shuffle(nonShuffledCards);
        this.played = [];
    }

    /**
     * Draws one card
     */
    public draw(): T {
        const card = this.cards.shift();
        if (this.cards.length === 0) {
            this.mixCards();
        }
        return card;
    }

    /**
     * Mixes the cards
     */
    public mixCards() {
        this.cards = _.shuffle(this.cards.concat(this.played));
        this.played = [];
    }
}
