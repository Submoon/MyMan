export interface IDeck {
    blackCards: IBlackCard[];
    whiteCards: string[];
    order: string[];
    sets: ISetGroup;
}

export interface IBlackCard {
    text: string;
    pick: number;
}

export interface ISet {
    name: string;
    white: string[];
    black: string[];
    icon: number | string;
}

export interface ISetGroup {
    [name: string]: ISet;
}
