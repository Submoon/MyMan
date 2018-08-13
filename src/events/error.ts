import {IExtendedClient} from "../api";
import BaseEvent from "../baseevent";
import logger from "../utils/logger";

export default class ErrorEvent extends BaseEvent {

    public error: Error;

    public constructor(client: IExtendedClient, args: any[]) {
        super(client, args);
        this.error = args.shift();
    }

    public async run(): Promise<void> {
        logger.error(`${this.error.name} : ${this.error.message}`);
    }
}
