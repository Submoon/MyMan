import { Channel, User } from "discord.js";
import { EventEmitter } from "events";
import * as _ from "lodash";
import { IBlackCard, IDeck } from "./cahapi";
import Player from "./player";
import Round from "./round";
export default class Game extends EventEmitter {

    public deck: IDeck;
    public players: Map<string, Player>;
    public turn: number;
    public deckWhiteCards: string[];
    public deckBlackCards: IBlackCard[];
    public playedWhiteCards: string[];
    public playedBlackCards: IBlackCard[];
    public rounds: Round[];

    public constructor(public readonly channel: Channel) {
        super();
        this.deck = require("./cahcards.json") as IDeck;
        this.players = new Map();
        this.turn = 0;
        this.deckWhiteCards = _.shuffle(this.deck.whiteCards);
        this.deckBlackCards = _.shuffle(this.deck.blackCards);
        this.playedWhiteCards = [];
        this.playedBlackCards = [];
    }

    public async addPlayer(user: User): Promise<Player> {
        if (this.players.get(user.id)) {
            throw new Error("You're already in the game !");
        }
        const player = new Player(user);

        for (let i = 0; i < 10; i++) {
            const card = this.deckWhiteCards.shift();
            player.drawCard(card);
        }

        this.players.set(player.user.id, player);
        return player;
    }

    public async playerLeave(playerId: string) {
        if (!this.players.delete(playerId)) {
            throw new Error("You are are not part of the game !");
        }
    }

    public async startGame() {
        throw new Error("Not implemented");
    }

    public async playTurn() {
        throw new Error("Not implemented");
    }

    public async playerPicked(playerId: string, cardIndex: number): Promise<number> {
        // return await this.players.get(playerId).pick(cardIndex);
        throw new Error("Not implemented!");
    }

}
