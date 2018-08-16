import { TextChannel, User } from "discord.js";
import { EventEmitter } from "events";
import * as _ from "lodash";
import logger from "../../utils/logger";
import { IBlackCard, ICahCards } from "./cahapi";
import CahMessageFormatter from "./CahMessageFormatter";
import Deck from "./deck";
import Player from "./player";
import Round from "./round";
export default class Game {
    
    public deck: ICahCards;
    public players: Player[];
    public turn: number;
    public deckWhiteCards: Deck<string>;
    public deckBlackCards: Deck<IBlackCard>;
    public round: Round;
    public waitingForCzarInput: boolean;

    public constructor(public readonly channel: TextChannel) {
        this.deck = require("./cahcards.json") as ICahCards;
        this.players = [];
        this.turn = 0;
        this.deckWhiteCards = new Deck(this.deck.whiteCards);
        this.deckBlackCards = new Deck(this.deck.blackCards);
        this.waitingForCzarInput = false;
    }

    public get started() {
        return this.round !== null;
    }

    /**
     * Destroys the game (removes listeners on the current Round)
     */
    public dispose() {
        this.round.removeAllListeners();
    }

    /**
     * Creates a new player from a user and adds it to this game
     * @param {User} user the user connecting
     * @returns {Player} the new player
     */
    public async addPlayer(user: User): Promise<Player> {
        if (this.players.find((p) => p.id === user.id)) {
            throw new Error("You're already in the game !");
        }
        const player = new Player(user);
        player.drawUntilFull(this.deckWhiteCards);

        this.players.push(player);

        // If we have more than 2 players, start the game
        if (this.players.length > 2 && !this.started) {
            this.startGame();
        }
        return player;
    }

    public async playerLeave(playerId: string) {
        const removed = _.remove(this.players, (p) => p.id === playerId);
        if (removed.length !== 1) {
            throw new Error("You are are not part of the game !");
        }
    }

    public async startGame() {
        await this.channel.send("Minimum number of players reached. Starting game!");
        await this.newRound();
    }

    public async sendChoices(r: Round) {
        this.round.removeAllListeners();
        const text = CahMessageFormatter.formatChoicesMessage(this.round.choices, this.round.blackCard);

        await this.channel.send(text);
        await this.channel.send(`Waiting for ${this.round.cardCzar.user.tag} to pick a winner.`);
        this.waitingForCzarInput = true;
    }

    public async playerPicked(playerId: string, cardIndexes: number[]) {
        const player = this.players.find((p) => p.id === playerId);
        return this.round.addPlayedCards(player, cardIndexes);
    }

    public async czarChose(userId: string, winnerIndex: number) {
        if (!this.started || !this.waitingForCzarInput) {
            await this.channel.send("Please wait for a round to be finished!");
            return;
        }
        if (this.round.cardCzar.id !== userId) {
            await this.channel.send("You are not the card czar.");
            return;
        }

        if (winnerIndex < 0 || winnerIndex > this.round.choices.length) {
            await this.channel.send(`Number ${winnerIndex} is not a valid option.`);
        }

        const winner = this.round.choices[winnerIndex];
        const text = `Winner is ${winner.player.user.tag}
        With:
        ${CahMessageFormatter.getBlackAndWhiteMix(this.round.blackCard, winner.cards)}`;
        await this.channel.send(text);
        
        await this.newRound();
    }

    private async newRound() {
        const oldCzar = this.round !== null ? this.round.cardCzar : null;
        // Getting czar, black card and players
        const newCzar = this.getNextCzar(oldCzar);
        const nextBlackCard = this.deckBlackCards.draw();
        const playingPlayers = _.filter(this.players, (p) => p.id !== newCzar.id);

        this.waitingForCzarInput = false;
        this.round = new Round(newCzar, nextBlackCard, playingPlayers);
        const roundText = `New round.
        ${newCzar.user.tag} is the card czar.
        Players for this round : ${playingPlayers.join(", ")}
        
        ${nextBlackCard.text}
        
        Please pick ${nextBlackCard.pick} cards.`;

        await this.channel.send(roundText);
        this.round.once("end", (r) => {
            this.sendChoices(r)
            .catch((err) => {
                logger.error("Dafuck happened");
            });
        });
    }

    private getNextCzar(oldCzar: Player): Player {
        // First round
        if (oldCzar === null) {
            return this.players[0];
        }
        // -1 if for some reason player has left in between, so it won't break
        const index = this.players.findIndex((p) => p.id === oldCzar.id);
        return index === this.players.length - 1 ? this.players[0] : this.players[index + 1];
        
    }

}
