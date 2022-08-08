import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import { AuditLogEvent, EmbedBuilder, GuildBan, TextChannel } from "discord.js"

export default class GuildBanAddEvent extends Event {
    constructor(client: EclipseClient) {
        super(client, {
            name: "guildBanAdd"
        })
    }

    async run(ban: GuildBan) {

        const date = new Date().toLocaleString("pt-BR", { 
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit" 
        })

        const audit = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd
        })

        const embed = new EmbedBuilder()
        embed.setColor("#04c4e4")
        embed.setDescription([
            `Motivo: **${ban.reason ?? "Nenhum motivo informado"}**`,
            `Banido por: **${audit.entries.first()?.executor?.tag}** (ID: ${audit.entries.first()?.executor?.id})`
        ].join("\n"))

        const channel = this.client.channels.cache.get(db.get(`${ban.guild!.id}.modlogs`)) as TextChannel
        channel.send({
            content: `\`[${date}]\`\nUsuário ${ban.user.tag} (ID: ${ban.user.id}) foi banido`,
            embeds: [embed]
        })
    }
}