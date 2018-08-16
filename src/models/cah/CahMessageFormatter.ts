import { IBlackCard } from "./cahapi";
import ICardChoice from "./ICardChoice";

export default class CahMessageFormatter {
    public static formatChoicesMessage(choices: ICardChoice[], blackCard: IBlackCard) {
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
}
