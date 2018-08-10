import {IExtendedClient} from "../api";
import BaseEvent from "../baseevent";
import logger from "../utils/logger";

export default class ErrorEvent extends BaseEvent {

    public warning: string;
    public constructor(client: IExtendedClient, ...args) {
        super(client, args);
        this.warning = args.shift() as string;
    }

    public async run() {
        logger.warn(`${this.warning}`);
    }
}
