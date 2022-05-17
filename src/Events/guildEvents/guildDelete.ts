import { Guild, EmbedBuilder, WebhookClient } from "discord.js"
import config from "../../Utils/Config"
import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"

export default class GuildDeleteEvent extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "guildDelete"
        })
    }

    async run(guild: Guild) {
        let owner = await guild.members.fetch(guild.ownerId).catch(() => { })

        let totalServers = await this.client.machine.broadcastEval(`this.guilds.cache.size`)
        let embed = new EmbedBuilder()
        embed.setTitle("Removido de um servidor!")
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
        embed.setFooter({ text: `Cluster => ${this.client.cluster.id} (Shard => ${guild.shardId})` })
        embed.setThumbnail(guild.iconURL({ size: 2048, forceStatic: false }) || "https://cdn.discordapp.com/embed/avatars/0.png")

        new WebhookClient({
            url: config.hooks.guildDelete.url,
        }).send({
            username: this.client.user?.username,
            avatarURL: this.client.user?.displayAvatarURL(),
            content: `<a:cry:974175503403581440> Total de servidores agora: ${totalServers.flat(Infinity).length}`,
            embeds: [embed]
        })
    }
}
