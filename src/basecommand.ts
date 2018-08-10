import * as Discord from "discord.js";
import {ICommand, IExtendedClient} from "./api";

export default abstract class BaseCommand implements ICommand {
    public constructor(public client: IExtendedClient, public message: Discord.Message, public args: string[]) {
    }
    public abstract run(): Promise<void>;
}
