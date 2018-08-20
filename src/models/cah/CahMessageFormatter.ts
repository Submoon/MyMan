import { IBlackCard } from "./cahapi";
import ICardChoice from "./ICardChoice";
import Player from "./player";
import _ from "lodash";

export default class CahMessageFormatter {
    public static scoresMessage(players: Player[]): string {
        const sortedByScore = _.orderBy(players, ["points"], ["desc"]);
        const lines: string[] = [];
        sortedByScore.forEach((s) => {
            lines.push(`${s.toString}\t: ${s.points}`);
        });
        return lines.join("\n");
    }
    /**
     * Generates the choices message
     * @param {ICardChoice[]} choices the card choices
     * @param {IBlackCard} blackCard the black card
     * @returns {string} the choices Message
     */
    public static choicesMessage(
        choices: ICardChoice[],
        blackCard: IBlackCard
    ): string {
        const textForChoices: string[] = [];
        textForChoices.push("Here are the choices:");
        choices.forEach((choice, i) => {
            const text = `${i} : ${CahMessageFormatter.getBlackAndWhiteMix(
                blackCard,
                choice.cards
            )}`;
            textForChoices.push(text);
        });
        return textForChoices.join("\n");
    }

    /**
     * Generates text combining the black and white cards
     * @param {IBlackCard} blackCard the black card
     * @param {string[]} whiteCards the white cards
     * @returns {string} the black and white mixed text
     */
    public static getBlackAndWhiteMix(
        blackCard: IBlackCard,
        whiteCards: string[]
    ): string {
        let text = blackCard.text;
        if (blackCard.text.indexOf("_") === -1) {
            // If there is no _ in the black card, we put the white card's text at the end
            return `${blackCard.text} *${whiteCards[0]}*`;
        }
        whiteCards.forEach((w) => {
            text = text.replace("_", `*${w}*`);
        });
        return text;
    }

    /**
     * Generates the new round message
     * @param {Player} czar the card czar
     * @param {IBlackCard} blackCard the black card
     * @param {Player[]} playingPlayers the players playing this round
     * @returns {string} the new round Message
     */
    public static newRoundMessage(
        czar: Player,
        blackCard: IBlackCard,
        playingPlayers: Player[]
    ): string {
        const roundText =
            `New round.\n` +
            `${czar.user} is the card czar.\n` +
            `Players for this round : ${playingPlayers
                .map((p) => p.user)
                .join(", ")}\n\n` +
            `${blackCard.text}\n\n` +
            `Please pick ${blackCard.pick} cards.`;
        return roundText;
    }

    /**
     * Generates the winner message
     * @param {Player} winner the winner for this round
     * @param {IBlackCard} blackCard the black card
     * @returns {string} the winner Message
     */
    public static winnerMessage(
        winner: ICardChoice,
        blackCard: IBlackCard
    ): string {
        const text =
            `Winner is ${winner.player.user}, currently at ${
                winner.player.points
            } points\n` +
            `With:\n\n` +
            `${CahMessageFormatter.getBlackAndWhiteMix(
                blackCard,
                winner.cards
            )}`;
        return text;
    }
}
