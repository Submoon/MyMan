import { TextChannel, User } from "discord.js";
import Game from "./game";
import Player from "./player";

/**
 * Class GameManager
 */
class GameManager {
    /**
     * Instance of GameManager
     */
    public static getInstance(): GameManager {
        return this._instance || (this._instance = new this());
    }
    private static _instance: GameManager;

    /**
     * Map of games with channel IDs as keys
     */
    public games: Map<string, Game>;

    protected constructor() {
        this.games = new Map();
    }

    /**
     * Create a game in this channel
     * @param {TextChannel} channel
     * @return {Promise<Game>} the created game
     */
    public async createGame(
        channel: TextChannel,
        requiredWins: number
    ): Promise<Game> {
        const channelId = channel.id;
        if (this.games.get(channelId)) {
            throw new Error(
                "There is already a game on this channel! Please use the command cah_stop"
            );
        }
        const game = new Game(channel, requiredWins);
        this.games.set(channelId, game);

        game.once("end", (reason: string) => {
            game.channel.send("Stopping the CAH game:\n" + reason);
            this.destroyGame(game.channel.id);
        });
        return game;
    }

    /**
     * Destroys/finishes a current game
     * @param {string} channelId The channel id
     * @throws Will throw an error if there is no game to stop
     */
    public async destroyGame(channelId: string) {
        const game = this.games.get(channelId);
        this.throwIfNoGame(game);
        game.sendScores();
        game.dispose();
        game.removeAllListeners("end");
        this.games.delete(channelId);
        return game.channel;
    }

    /**
     * Makes the specified user join a cah game taking place in the specified channel
     * @param {string} channelId The channel Id
     * @param {User} user The user
     * @throws Will throw if there is no game to join in the specified channel
     * @return {Promise<Player>} the created player object
     */
    public async joinGame(channelId: string, user: User): Promise<Player> {
        const game = this.games.get(channelId);
        this.throwIfNoGame(game);
        const player = await game.addPlayer(user);
        return player;
    }

    /**
     * Makes the player with the specified userId leave the cah game
     * taking place in the channel with the specified channelId
     * @param {string} channelId The channel ID
     * @param {string} userId The user ID
     * @throws Will throw if there is no game to leave in the specified channel
     */
    public async playerLeave(channelId: string, userId: string) {
        const game = this.games.get(channelId);
        this.throwIfNoGame(game);
        await game.playerLeave(userId);
    }

    /**
     * Makes the player with the specified userId pick the cards corresponding to the cardIndexes
     * for the game taking place in the specified channelId
     * @param {string} channelId the channel ID
     * @param {string} userId the user ID
     * @param {number[]} cardIndexes the card indexes
     */
    public async playerPicked(
        channelId: string,
        userId: string,
        cardIndexes: number[]
    ) {
        const game = this.games.get(channelId);
        this.throwIfNoGame(game);
        return game.playerPicked(userId, cardIndexes);
    }

    /**
     * Makes the player with the specified userID choose a winner
     * for the game taking place in the specified channelId.
     * Only works if the user is the current card czar
     * @param {string} channelId the channel ID
     * @param {string} userId the user ID
     * @param {number} winnerIndex the winner index
     */
    public async czarChose(
        channelId: string,
        userId: string,
        winnerIndex: number
    ) {
        const game = this.games.get(channelId);
        this.throwIfNoGame(game);
        return game.czarChose(userId, winnerIndex);
    }

    /**
     * Displays the score the the specified game
     * @param channelId the channel ID
     */
    public async displayScore(channelId: string) {
        const game = this.games.get(channelId);
        this.throwIfNoGame(game);
        return game.sendScores();
    }

    /**
     * Throws an exception if game is null
     * @param game the game to check
     * @throws if game is null
     */
    private throwIfNoGame(game: Game) {
        if (!game) {
            throw new Error("There is no game in this channel");
        }
    }
}

export default GameManager.getInstance();
