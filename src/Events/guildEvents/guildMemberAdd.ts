import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import { GuildMember } from "discord.js"

export default class GuildMemberAddEvent extends Event {
    constructor(client: EclipseClient) {
        super(client, {
            name: "guildMemberAdd"
        })
    }

    async run(member: GuildMember) {
        const guild = member.guild
        
        const rolesIds = db.get(`${guild.id}.autorole`) as string[]

        if (!rolesIds) return;

        const roles = rolesIds.map(id => guild.roles.cache.get(id))

        for (const role of roles) {
            if (!role) continue;
            member.roles.add(role).catch(() => { })
        }
    }
}