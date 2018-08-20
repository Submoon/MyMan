import { Message, TextChannel, User } from "discord.js";
import { EventEmitter } from "events";
import * as _ from "lodash";
import logger from "../../utils/logger";
import { IBlackCard, ICahCards } from "./cahapi";

import { isNullOrUndefined } from "util";
import allCahCards from "../../../cahcards.json";
import CahMessageFormatter from "./cahmessageformatter";
import Deck from "./deck";
import Player from "./player";
import Round from "./round";

export default class Game {
    /**
     * Minimum number of players
     */
    public static readonly MINPLAYERS = 3;
    /**
     * Players in the game
     */
    public players: Player[];
    /**
     * Deck of white cards
     */
    public deckWhiteCards: Deck<string>;
    /**
     * Deck of black cards
     */
    public deckBlackCards: Deck<IBlackCard>;
    /**
     * Current round
     */
    public round: Round;
    /**
     * true if we're waiting for the czar input, false if it's not the case
     */
    public waitingForCzarInput: boolean;

    /**
     * Generates a new game for the specified channel
     * @param {TexChannel} channel the channel in which the game will take place
     */
    public constructor(public readonly channel: TextChannel) {
        // this.allCahCards = require("../../../cahcards.json") as ICahCards;
        this.players = [];
        this.deckWhiteCards = new Deck(allCahCards.whiteCards);
        this.deckBlackCards = new Deck(allCahCards.blackCards);
        this.waitingForCzarInput = false;
    }

    /**
     * Returns true if the game has started
     */
    public get started() {
        return this.round != null;
    }

    /**
     * Destroys the game (removes listeners on the current Round)
     */
    public dispose() {
        logger.info(`Disposing of game on channel ${this.channel.name}`);
        if (this.round != null) {
            this.round.removeAllListeners();
        }
    }

    /**
     * Creates a new player from a user and adds it to this game
     * @param {User} user the user connecting
     * @returns {Promise<Player>} the new player
     */
    public async addPlayer(user: User): Promise<Player> {
        if (this.players.find((p) => p.id === user.id)) {
            throw new Error("You're already in the game !");
        }
        logger.info(`Creating a new player for user ${user.tag}`);
        const player = new Player(user);

        player.drawUntilFull(this.deckWhiteCards);

        this.players.push(player);

        // If we have more than MINPLAYERS players, start the game
        if (this.players.length >= Game.MINPLAYERS && !this.started) {
            logger.info("Minimum player count reached, starting game in 30s");
            await this.channel.send("Game will start in 30 seconds!");
            setTimeout(async () => {
                await this.startGame();
            }, 30000);
        }
        return player;
    }

    /**
     * Makes the specified player leave this game
     * @param {string} playerId the player id
     */
    public async playerLeave(playerId: string) {
        const removed = _.remove(this.players, (p) => p.id === playerId);

        // No player found
        if (removed.length !== 1) {
            logger.warn(
                `Player ${playerId} tried to leave the game on ${
                    this.channel.name
                }` + ` but is not part of this game`
            );
            throw new Error("You are are not part of the game !");
        }

        if (this.round) {
            if (
                this.round.cardCzar.id === playerId ||
                this.waitingForCzarInput
            ) {
                // If he was the card czar, just create a new round

                // If we're waiting for the czar to choose (cards have been revealed), don't give them back
                this.round.giveCardsBack();
                this.newRound();
                return;
            }
            // Removing player from current round
            const removedFromRound = this.round.removePlayer(playerId);
        }
    }

    /**
     * Starts this game
     */
    public async startGame() {
        logger.info("Starting game");
        await this.channel.send(
            "Minimum number of players reached. Starting game!"
        );
        await this.newRound();
    }

    /**
     * Sends the choices to the czar and then waits for him to select the winner
     * @param {Round} r the current round
     */
    public async sendChoices(r: Round) {
        logger.info("Removing listeners from current round");
        this.round.removeAllListeners();
        logger.info(r.toString());
        const text = CahMessageFormatter.choicesMessage(
            this.round.choices,
            this.round.blackCard
        );

        await this.channel.send(text);
        await this.channel.send(
            `Waiting for ${this.round.cardCzar.user} to pick a winner.`
        );
        this.waitingForCzarInput = true;
    }

    /**
     * Specified player picks the cards corresponding to the specified indexes
     * (Corresponding to the indexes in his hand)
     * @param {string} playerId the player id
     * @param {number[]} cardIndexes the card indexes
     */
    public async playerPicked(playerId: string, cardIndexes: number[]) {
        if (!this.started) {
            throw new Error("Game hasn't started yet.");
        }
        if (this.waitingForCzarInput) {
            logger.warn(
                `Waiting for czar input but received ${cardIndexes.join()} from ${playerId}`
            );
            return false;
        }
        const player = this.players.find((p) => p.id === playerId);
        this.round.addPlayedCards(player, cardIndexes);
        // this.channel.send(`${player.user} played ${cardIndexes.join(", ")}!`);
        return true;
    }

    /**
     * Czar choose the player with the specified index in the current round as winner
     * @param {string} userId the czar user id
     * @param {number} winnerIndex the winner index
     */
    public async czarChose(userId: string, winnerIndex: number) {
        if (!this.started || !this.waitingForCzarInput) {
            await this.channel.send("Please wait for a round to be over!");
            return;
        }
        if (this.round.cardCzar.id !== userId) {
            await this.channel.send("You are not the card czar.");
            return;
        }

        if (
            winnerIndex < 0 ||
            winnerIndex > this.round.choices.length - 1 ||
            isNaN(winnerIndex) ||
            winnerIndex == null
        ) {
            await this.channel.send(
                `Number ${winnerIndex} is not a valid option.`
            );
            return;
        }

        logger.info(
            `Received ${winnerIndex} as a choice from the current czar`
        );

        const winner = this.round.choices[winnerIndex];
        logger.info(`Winner is ${winner.player.user.tag}`);
        winner.player.earnPoint();
        await this.channel.send(
            CahMessageFormatter.winnerMessage(winner, this.round.blackCard)
        );

        await this.newRound();
    }

    /**
     * Displays the score for this game
     */
    public async sendScores() {
        const text = CahMessageFormatter.scoresMessage(this.players);
        await this.channel.send(text);
    }

    /**
     * Generates a new round and changes round
     */
    private async newRound() {
        // Discard all played cards
        if (this.round != null) {
            const playedWhiteCards = _.flatten(
                this.round.choices.map((c) => c.cards)
            );

            this.deckWhiteCards.discard(...playedWhiteCards);
            this.deckBlackCards.discard(this.round.blackCard);
        }

        this.waitingForCzarInput = false;

        // If there's not enough players, pause the game
        if (this.players.length < Game.MINPLAYERS) {
            await this.channel.send(
                "Not enough players, waiting for additional players"
            );
            this.round = null;
            return;
        }

        logger.info("Generating new round");
        const oldCzar = this.round != null ? this.round.cardCzar : null;
        // Getting czar, black card and players
        const newCzar = this.getNextCzar(oldCzar);
        const nextBlackCard = this.deckBlackCards.draw();
        const playingPlayers = _.filter(
            this.players,
            (p) => p.id !== newCzar.id
        );

        this.round = new Round(newCzar, nextBlackCard, playingPlayers);
        const roundText = CahMessageFormatter.newRoundMessage(
            newCzar,
            nextBlackCard,
            playingPlayers
        );
        logger.info(
            `New round created with czar: ${newCzar},` +
                ` blackCard: ${
                    nextBlackCard.text
                } and playing players: ${playingPlayers.map((p) => p.user.tag)}`
        );

        // Filling player's hands
        const roundMessage = (await this.channel.send(roundText)) as Message;
        this.round.players.forEach((p) => {
            p.drawUntilFull(this.deckWhiteCards);
            const printedCards = p.printCards(roundMessage, nextBlackCard);
            p.user.send(printedCards);
        });

        // Event when round is over
        this.round.once("end", (r) => {
            logger.info("Received end evnt from round");
            this.sendChoices(r).catch((err: Error) => {
                logger.error(`Error: ${err.message}`);
            });
        });
    }

    /**
     * Retrieves the next card czar
     * @param {Player} oldCzar the old card czar
     * @returns {Player} the next czar
     */
    private getNextCzar(oldCzar: Player): Player {
        logger.info("Retrieving next czar");
        // First round
        if (oldCzar === null) {
            logger.info(
                "No previous czar found, getting first player as czar instead"
            );
            return this.players[0];
        }
        logger.info("Found previous czar, getting next player as czar");
        // -1 if for some reason player has left in between, so it won't break
        const index = this.players.findIndex((p) => p.id === oldCzar.id);
        return index === this.players.length - 1
            ? this.players[0]
            : this.players[index + 1];
    }
}
