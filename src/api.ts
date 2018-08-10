import * as Discord from "discord.js";
import { Message } from "discord.js";

export interface IConfig {
    token: "NDAzMjEzMzgzNDg4MzcyNzQ4.DUECDA.9ToUPg27IHvWgWmtjcw0kiLcrO0";
    adminId: "My user Id";
    prefix: "&";
    dropboxAccessToken: "tn9JanDQ0b4AAAAAAABXLjHfwzXF-4tDHB3hX2aDtDVdwa-XX1bhtbBTpDXEUfjC";
    productiondatabaseuser: "productiondatabaseuser";
    productiondatabasepassword: "productiondatabasepassword";
    testdatabaseuser: "testdatabaseuser";
    testdatabasepassword: "testdatabasepassword";
}

export interface IExtendedClient extends Discord.Client {
    config: IConfig;
    commands: ICommandConstructor[];
}

export interface IDescription {
    text: string;
    usage: string;
}

export interface ICommand {
    client: IExtendedClient;
    message: Discord.Message;
    args: string[];
    run(): Promise<void>;
}

export interface IEvent {
    client: IExtendedClient;
    args: any[];
    run(): Promise<void>;
}

export interface IEventConstructor {
    new (client: IExtendedClient, ...args: any[]): IEvent;
}

export interface ICommandConstructor {
    new (client: IExtendedClient, message: Message,  ...args: any[]): ICommand;
}
