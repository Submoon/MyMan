import { Message } from "discord.js";
import { IExtendedClient } from "../../api";
import BaseCommand from "../../basecommand";
import logger from "../../utils/logger";

export default class ColorSetCommand extends BaseCommand {

    constructor(client: IExtendedClient, message: Message, args: string[]) {
        super(client, message, args);
    }

    static get description() {
        return  {
            text: "Creates a role linked to the user, and set the role's color to the given color",
            usage: "color_set color",
        };
    }

    public async run() {

        const guild = this.message.guild;
        const id = this.message.author.id;
        let position = 1;
        const nameRole = `color{${id}}`;
        let [color] = this.args;

        if (!color) {
            color = "RANDOM";
        }
        const roleFound = await this.message.guild.roles.find((role) => role.name === nameRole);

        if (roleFound) {
            logger.info(`Role ${roleFound} was found`);
            await roleFound.setColor(color);
            logger.info(`Changing color of role ${roleFound} to ${color}`);
        } else {
            logger.info(`Role ${nameRole} was not found`);

            const argrole = {
                color,
                name : nameRole,
            };

            logger.info(`Creating role ${argrole}`);
            const role = await this.message.guild.createRole(argrole);
            logger.info(`role ${role} created`);
            logger.debug(`Updating positions of all roles`);
            guild.setRolePosition(role, position);

            const bot = guild.member(this.client.user);
            const roleBot = bot.highestRole;

            position = roleBot.position - 1;
            logger.info(`Trying to set role ${role} postion to ${position}. Current position: ${roleBot.position}`);

            try {guild.setRolePosition(role, position); } catch (error) {
                // In case Discord refuses to change the role's position. Unlikely to happen.
                logger.error(`Error while setting role ${role} position to ${position}.`
                    + `Position is still ${role.position}`);
                logger.error(`Deleting ${role}`);
                await role.delete();
                 // Deleting the role and using again the set command makes it work
                this.message.channel.send("Error, please try again");
                return;
            }
            const user = guild.member(this.message.author);
            await user.addRole(role);
            logger.info(`role ${role} given to user ${user}`);
            this.message.channel.send("New color given !");
        }
    }
}
