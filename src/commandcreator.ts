import { Message } from "discord.js";
import { ICommand, IExtendedClient } from "./api";

interface ICommandConstructor<T extends ICommand> {
    new (client: IExtendedClient, message: Message, ...args: any[]): T;
}

export default class CommandCreator<T extends ICommand> {
    constructor(private ctor: ICommandConstructor<T>) {

    }
    public getNew(client: IExtendedClient, message: Message, ...args: any[]) {
        return new this.ctor(client, message, ...args);
    }
}
