import { Message, TextChannel, User } from "discord.js";
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
        return this.round != null;
    }

    /**
     * Destroys the game (removes listeners on the current Round)
     */
    public dispose() {
        logger.info(`Disposing of game on channel ${this.channel.name}`);
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
        logger.info(`Creating a new player for user ${user.tag}`);
        const player = new Player(user);
        
        player.drawUntilFull(this.deckWhiteCards);

        this.players.push(player);

        // If we have more than 2 players, start the game
        if (this.players.length > 1 && !this.started) {
            logger.info("Minimum player count reached, starting game in 30s");
            await this.channel.send("Game will start in 30 seconds!");
            setTimeout(async () => {
                await this.startGame();
            }, 30000);
            
        }
        return player;
    }

    public async playerLeave(playerId: string) {
        const removed = _.remove(this.players, (p) => p.id === playerId);
        if (removed.length !== 1) {
            logger.warn(`Player ${playerId} tried to leave the game on ${this.channel.name}`
            + ` but is not part of this game`);
            throw new Error("You are are not part of the game !");
        }
    }

    public async startGame() {
        logger.info("Starting game");
        await this.channel.send("Minimum number of players reached. Starting game!");
        await this.newRound();
    }

    public async sendChoices(r: Round) {
        logger.info("Removing listeners from current round");
        this.round.removeAllListeners();
        logger.info(r.toString());
        const text = CahMessageFormatter.choicesMessage(this.round.choices, this.round.blackCard);

        await this.channel.send(text);
        await this.channel.send(`Waiting for ${this.round.cardCzar.user} to pick a winner.`);
        this.waitingForCzarInput = true;
    }

    public async playerPicked(playerId: string, cardIndexes: number[]) {
        if (!this.started) {
            throw new Error("Game hasn't started yet.");
        }
        if (this.waitingForCzarInput) {
            logger.warn(`Waiting for czar input but received ${cardIndexes.join()} from ${playerId}`);
            return;
        }
        const player = this.players.find((p) => p.id === playerId);
        this.round.addPlayedCards(player, cardIndexes);
        this.channel.send(`${player.user} played ${cardIndexes.join(", ")}!`);
        return;
    }

    public async czarChose(userId: string, winnerIndex: number) {
        if (!this.started || !this.waitingForCzarInput) {
            await this.channel.send("Please wait for a round to be over!");
            return;
        }
        if (this.round.cardCzar.id !== userId) {
            await this.channel.send("You are not the card czar.");
            return;
        }

        if (winnerIndex < 0 || winnerIndex > this.round.choices.length) {
            await this.channel.send(`Number ${winnerIndex} is not a valid option.`);
            return;
        }

        logger.info(`Received ${winnerIndex} as a choice from the current czar`);

        const winner = this.round.choices[winnerIndex];
        logger.info(`Winner is ${winner.player.user.tag}`);

        await this.channel.send(CahMessageFormatter.winnerMessage(winner, this.round.blackCard));
        
        await this.newRound();
    }

    private async newRound() {
        logger.info("Generating new round");
        const oldCzar = this.round != null ? this.round.cardCzar : null;
        // Getting czar, black card and players
        const newCzar = this.getNextCzar(oldCzar);
        const nextBlackCard = this.deckBlackCards.draw();
        const playingPlayers = _.filter(this.players, (p) => p.id !== newCzar.id);

        this.waitingForCzarInput = false;
        this.round = new Round(newCzar, nextBlackCard, playingPlayers);
        const roundText = CahMessageFormatter.newRoundMessage(newCzar, nextBlackCard, playingPlayers);
        logger.info(`New round created with czar: ${newCzar},`
            + ` blackCard: ${nextBlackCard.text} and playing players: ${playingPlayers.map((p) => p.user.tag)}`);

        const roundMessage = await this.channel.send(roundText) as Message;
        this.round.players.forEach((p) => {
            p.drawUntilFull(this.deckWhiteCards);
            const printedCards = p.printCards(roundMessage);
            p.user.send(printedCards);
        });
        
        this.round.once("end", (r) => {
            logger.info("Received end evnt from round");
            this.sendChoices(r)
            .catch((err: Error) => {
                logger.error(`Error: ${err.message}`);
            });
        });
    }

    private getNextCzar(oldCzar: Player): Player {
        logger.info("Retrieving next czar");
        // First round
        if (oldCzar === null) {
            logger.info("No previous czar found, getting first player as czar instead");
            return this.players[0];
        }
        logger.info("Found previous czar, getting next player as czar");
        // -1 if for some reason player has left in between, so it won't break
        const index = this.players.findIndex((p) => p.id === oldCzar.id);
        return index === this.players.length - 1 ? this.players[0] : this.players[index + 1];
        
    }

}
