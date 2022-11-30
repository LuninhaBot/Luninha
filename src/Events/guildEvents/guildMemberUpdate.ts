import Event from "../../Structures/Event"
import LuninhaClient from "../../Structures/LuninhaClient"
import { GuildMember } from "discord.js"

export default class GuildMemberUpdateEvent extends Event {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "guildMemberUpdate"
        })
    }

    async run(oldMember: GuildMember, newMember: GuildMember) {

        if (newMember.pending == true) return;

        if (newMember.pending == false) {
            const guild = newMember.guild
        
            const rolesIds = db.get(`${guild.id}.autorole`) as string[]
    
            if (!rolesIds) return;
    
            const roles = rolesIds.map(id => guild.roles.cache.get(id))
    
            for (const role of roles) {
                if (!role) continue;
                newMember.roles.add(role).catch(() => { })
            }
        }
    }
}