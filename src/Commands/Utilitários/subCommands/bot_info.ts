import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"

export default class BotInfoSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "bot_info",
            category: "Utilitários",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {
    

        const embed = new EmbedBuilder()
        embed.setColor(this.client.defaultColor)
        embed.setAuthor({ iconURL: this.client.user!.avatarURL({ size: 4096 }) ?? "", name: this.client.user!.username })
        embed.setDescription([
            `Heyo, eu sou a **${this.client.user!.username}**! um bot de música e moderação que está em desenvolvimento.`,
            `Fui criada <t:${~~(this.client.user!.createdTimestamp / 1000)}:R> ( <t:${~~(this.client.user!.createdTimestamp / 1000)}:F> )`,
        ].join("\n"))

        embed.addFields([
            {
                name: "Estatísticas",
                value: [
                    `🖥️ Servidores: **${this.client.guilds.cache.size.toLocaleString()}**`,
                    `🤖 Usuários: **${this.client.guilds.cache.map(g => g.memberCount).reduce((a, g) => a + g, 0).toLocaleString()}**`,
                    `📚 Shards: **${this.client.ws.shards.size.toLocaleString()}**`,
                    `💾 Memória: **${this.client.utils.formatBytes(process.memoryUsage().rss)}**`,
                    `🕛 Uptime: **${this.client.utils.time(this.client!.uptime ?? 0)}**`
                ].join("\n")
            }
        ])

        const inviteButton = new ButtonBuilder({
            style: ButtonStyle.Link,
            label: "Me convide",
            url: "https://discord.com/api/oauth2/authorize?client_id=683040461434388501&permissions=8&scope=bot%20applications.commands"
        })

        const supportButton = new ButtonBuilder({
            style: ButtonStyle.Link,
            label: "Servidor de suporte",
            url: "https://discord.gg/Ce2EhRkYe6"
        })

        const sourceButton = new ButtonBuilder({
            style: ButtonStyle.Link,
            label: "Código fonte",
            url: "https://github.com/luninha-lab"
        })


        const actionRow = new ActionRowBuilder<ButtonBuilder>()
        actionRow.addComponents([inviteButton, supportButton, sourceButton])

        interaction.followUp({
            embeds: [embed],
            components: [actionRow]
        })
    }
}