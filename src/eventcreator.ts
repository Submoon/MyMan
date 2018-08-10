import { IEvent, IExtendedClient } from "./api";

interface IEventConstructor<T extends IEvent> {
    new (client: IExtendedClient, ...args: any[]): T;
}

export default class EventCreator<T extends IEvent> {
    constructor(private ctor: IEventConstructor<T>) {

    }
    public getNew(client: IExtendedClient, ...args: any[]) {
        return new this.ctor(client, ...args);
    }
}
