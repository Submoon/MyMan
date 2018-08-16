import { IBlackCard } from "./cahapi";
import ICardChoice from "./ICardChoice";
import Player from "./player";

export default class CahMessageFormatter {
    public static choicesMessage(choices: ICardChoice[], blackCard: IBlackCard) {
        const textForChoices: string[] = [];
        textForChoices.push("Here are the choices:");
        choices.forEach((choice, i) => {
            const text = `${i} : ${CahMessageFormatter.getBlackAndWhiteMix(blackCard, choice.cards)}`;
            textForChoices.push(text);
        });
        return textForChoices.join("\n");
    }

    public static getBlackAndWhiteMix(blackCard: IBlackCard, whiteCards: string[]): string {
        let text = blackCard.text;
        if (blackCard.text.indexOf("_") === -1) {
            return `${blackCard.text} *${whiteCards[0]}*`;
        }
        whiteCards.forEach((w) => {
            text = text.replace("_", `*${w}*`);
        });
        return text;
    }

    public static newRoundMessage(czar: Player, blackCard: IBlackCard, playingPlayers: Player[]) {
        const roundText = `New round.\n`
        + `${czar.user} is the card czar.\n`
        + `Players for this round : ${(playingPlayers.map((p) => p.user).join(", "))}\n\n`
        
        + `${blackCard.text}\n\n`
        
        + `Please pick ${blackCard.pick} cards.`;
        return roundText;
    }

    public static winnerMessage(winner: ICardChoice, blackCard: IBlackCard) {
        const text = `Winner is ${winner.player.user}\n`
        + `With:\n\n`
        + `${CahMessageFormatter.getBlackAndWhiteMix(blackCard, winner.cards)}`;
        return text;
    }
}
