import { GuildMember } from "discord.js";

// Map used in the 'jum_dispo' and 'jump_list' commands to list all available users.
export const dispoList = new Map<GuildMember, 0 | 1>();
