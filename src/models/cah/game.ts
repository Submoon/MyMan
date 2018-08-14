"use strict";

import { Channel, User } from "discord.js";
import * as _ from "lodash";
import { IBlackCard, IDeck } from "./cahapi";
import Player from "./player";
export default class Game {

    public deck: IDeck;
    public players: Map<string, Player>;
    public turn: number;
    public deckWhiteCards: string[];
    public deckBlackCards: IBlackCard[];
    public playedWhiteCards: string[];
    public playedBlackCards: IBlackCard[];

    constructor(public channel: Channel) {
        this.deck = require("./cahcards.json") as IDeck;
        this.players = new Map();
        this.turn = 0;
        this.deckWhiteCards = _.shuffle(this.deck.whiteCards);
        this.deckBlackCards = _.shuffle(this.deck.blackCards);
        this.playedWhiteCards = [];
        this.playedBlackCards = [];
    }

    public async addPlayer(user: User): Player {
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

    public async playerPicked(playerId: string, cardId: number) {
        this.players.get(playerId).picked = cardId;
    }

}
