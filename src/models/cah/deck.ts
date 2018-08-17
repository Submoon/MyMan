import * as _ from "lodash";

export default class Deck<T> {
    /**
     * Deck pile
     */
    private cards: T[];

    /**
     * The discard pile
     */
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
     * @returns {T} the card
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

    /**
     * Adds the specified cards to the discard pile
     * @param cards the discarded cards
     */
    public discard(...cards: T[]) {
        this.played.push(...cards);
    }
}
