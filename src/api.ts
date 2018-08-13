import * as Discord from "discord.js";
import { Message } from "discord.js";

export interface IConfig {
    token: string;
    adminId: string;
    prefix: string;
    dropboxAccessToken: string;
    productiondatabaseuser: string;
    productiondatabasepassword: string;
    testdatabaseuser: string;
    testdatabasepassword: string;
}

export interface IExtendedClient extends Discord.Client {
    config: IConfig;
    commands: Map<string, ICommandConstructor>;
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
    description: IDescription;
    new (client: IExtendedClient, message: Message,  ...args: any[]): ICommand;
}
