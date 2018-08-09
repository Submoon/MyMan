import logger from '../utils/logger';
import {BaseEvent, IExtendedClient} from '../api';

export default class ReadyEvent extends BaseEvent{

    async run() {
        logger.info(`Bot started in ${process.env.NODE_ENV} mode !`);
        this.updateUsers(this.client);
        this.client.setInterval(this.updateUsers, 60000, this.client);
    }

    async updateUsers(client: IExtendedClient) {
        let users = client.users.filterArray(u => !u.bot);
        let nbOfUsers = users.length;
            
        await client.user.setActivity(`${nbOfUsers} users sleep`, {type: 'WATCHING'});
    }
}


    