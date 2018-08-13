import * as Discord from "discord.js";
import {IEvent, IExtendedClient} from "./api";

export default abstract class BaseEvent implements IEvent {
    public constructor(public client: IExtendedClient, public args: any[]) { }
    public abstract run(): Promise<void>;
}
