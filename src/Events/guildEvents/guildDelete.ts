import { Guild, EmbedBuilder, WebhookClient } from "discord.js"
import { WebHooks } from "../../Utils/Config"
import Event from "../../Structures/Event"
import LuninhaClient from "../../Structures/LuninhaClient"

export default class GuildDeleteEvent extends Event {

    constructor(client: LuninhaClient) {
        super(client, {
            name: "guildDelete"
        })
    }

    async run(guild: Guild) {
        let owner = await guild.members.fetch(guild.ownerId).catch(() => { })

        db.delete(`${guild.id}.dj`)
        db.delete(`${guild.id}.autorole`)
        db.delete(`${guild.id}.modlogs`)

        const embed = new EmbedBuilder()
        embed.setTitle("Removida de um servidor!")
        embed.setFields([
            {
                name: "Informaçoes:",
                value: [
                    `• Nome: ${guild.name}`,
                    `• Dono: ${owner?.user.tag ?? "Não encontrado"}`,
                    `• Canais: ${guild.channels.cache.size}`,
                    `• Membros: ${guild.memberCount}`
                ].join("\n"),
                inline: false
            },
            {
                name: "Data:",
                value: [
                    `• Criado em: ${guild.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
                ].join("\n"),
            }
        ])
        embed.setColor("Red")
        embed.setFooter({ text: `Cluster => 0 (Shard => ${guild.shardId})` })
        embed.setThumbnail(guild.iconURL({ size: 2048, forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")

        new WebhookClient({
            url: WebHooks.guildDelete.url,
        }).send({
            username: this.client.user?.username,
            avatarURL: this.client.user?.displayAvatarURL(),
            embeds: [embed]
        })
    }
}
