import {IExtendedClient} from "../api";
import BaseEvent from "../baseevent";
import logger from "../utils/logger";

export default class ReadyEvent extends BaseEvent {

    public async run() {
        logger.info(`Bot started in ${process.env.NODE_ENV} mode !`);
        this.updateUsers(this.client);
        this.client.setInterval(this.updateUsers, 60000, this.client);
    }

    public async updateUsers(client: IExtendedClient): Promise<void> {
        const users = client.users.filter((u) => !u.bot);
        const nbOfUsers = users.size;

        await client.user.setActivity(`${nbOfUsers} users sleep`, {type: "WATCHING"});
    }
}
