import logger from '../utils/logger';
import {IExtendedClient, BaseEvent} from '../api';

export default class ErrorEvent extends BaseEvent{

    public error: Error;

    constructor(client: IExtendedClient, args: any[]){
        super(client, args);
        this.error = args.shift();
    }
    async run(): Promise<void> {
        logger.error(`${this.error.name} : ${this.error.message}`);
    }
}


    