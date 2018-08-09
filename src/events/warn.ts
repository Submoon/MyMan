import logger from '../utils/logger';
import {IExtendedClient, BaseEvent} from '../api';

export default class ErrorEvent extends BaseEvent{

    public warning: string;
    constructor(client: IExtendedClient, ...args){
        super(client, args);
        this.warning = args.shift() as string;
    }
    
    async run() {
        logger.warn(`${this.warning}`);
    }
}


    