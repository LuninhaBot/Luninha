import { Guild, EmbedBuilder, WebhookClient } from "discord.js"
import { WebHooks } from "../../Utils/Config"
import Event from "../../Structures/Event"
import LuninhaClient from "../../Structures/LuninhaClient"

export default class GuildCreateEvent extends Event {

    constructor(client: LuninhaClient) {
        super(client, {
            name: "guildCreate"
        })
    }

    async run(guild: Guild) {
        const owner = await guild.members.fetch(guild.ownerId).catch(() => { })

        const embed = new EmbedBuilder()
        embed.setTitle("Adicionada em um novo servidor!")
        embed.setFields([
            {
                name: "Informaçoes:",
                value: [
                    `• Nome: ${guild.name}`,
                    `• Dono: ${owner?.user.tag ?? "Não encontrado"}`,
                    `• Canais: ${guild.channels.cache.size}`,
                    `• Membros: ${guild.memberCount}`,
                    `• ID: ${guild.id}`
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
        embed.setFooter({ text: `Cluster => 0 (Shard => ${guild.shardId})` })
        embed.setThumbnail(guild.iconURL({ size: 2048, forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")

        new WebhookClient({
            url: WebHooks.guildCreate.url,
        }).send({
            username: this.client.user?.username,
            avatarURL: this.client.user?.displayAvatarURL(),
            embeds: [embed]
        })
    }
}
