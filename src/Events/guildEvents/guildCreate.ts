import { Guild, EmbedBuilder, WebhookClient } from "discord.js"
import config from "../../Utils/Config"
import Event from "../../Structures/Event"
import type NFTCordClient from "../../Structures/NFTCordClient"

export default class GuildCreateEvent extends Event {

    constructor(client: NFTCordClient) {
        super(client, {
            name: "guildCreate"
        })
    }

    async run(guild: Guild) {
        let owner = await guild.members.fetch(guild.ownerId).catch(() => null)

        let embed = new EmbedBuilder()
        embed.setTitle("Adicionada em um novo servidor!")
        embed.setFields([
            {
                name: "Informaçoes:",
                value: [
                    `• Nome: ${guild.name}`,
                    `• Dono: ${owner?.user.tag}`,
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
        embed.setColor("Blue")
        embed.setFooter({ text: guild.id })
        embed.setThumbnail(guild.iconURL({ size: 2048, forceStatic: false }) || "https://cdn.discordapp.com/embed/avatars/0.png")

        new WebhookClient({
            url: config.hooks.guildCreate.url,
        }).send({
            username: this.client.user?.username,
            avatarURL: this.client.user?.displayAvatarURL(),
            content: `:heart: Total de servidores agora: ${this.client.guilds.cache.size}`,
            embeds: [embed]
        })
    }
}
