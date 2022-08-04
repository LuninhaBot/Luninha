import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js"
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class InviteCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "bot",
            subCommands: ["convite", "info"],
            description: "Veja algumas informações sobre mim.",
            category: "Outros",
            marks: {
                updated: true
            }
        })
    }

    async run({ interaction }: RunCommand) {

        const subCommand = interaction.options.getSubcommand(false)

        if (subCommand == "convite") {
            await interaction.deferReply({ ephemeral: true, fetchReply: true })

            interaction.followUp({
                content: "Que bom que gostou das minhas funcionalidades -> [Convite aqui](https://discord.com/api/oauth2/authorize?client_id=683040461434388501&permissions=8&scope=bot%20applications.commands)",
                ephemeral: true
            })

            return;
        }

        if (subCommand == "info") {

            await interaction.deferReply({ fetchReply: true })

            const servers = await this.client.machine.broadcastEval("this.guilds.cache.size") as number[]
            const allServers = servers.flat(Infinity).reduce((a, b) => a + b)

            const users = await this.client.machine.broadcastEval("this.guilds.cache.map(g => g.memberCount).reduce((a, g) => a + g, 0)") as number[]
            const allUsers = users.flat(Infinity).reduce((a, b) => a + b)

            const shards = await this.client.machine.broadcastEval("this.ws.shards.map(s => s.id).reduce((a, g) => a + g, 0)") as number[]
            const allShards = shards.flat(Infinity).reduce((a, b) => a + b)

            const players = await this.client.machine.broadcastEval("this.music.players.size") as number[]
            const allPlayers = players.flat(Infinity).reduce((a, b) => a + b)

            const memory = await this.client.machine.broadcastEval("process.memoryUsage().rss") as number[]

            const embed = new EmbedBuilder()
            embed.setColor("#04c4e4")
            embed.setAuthor({ iconURL: this.client.user!.avatarURL({ size: 4096 }) ?? "", name: this.client.user!.username })
            embed.setDescription([
                `Heyo, eu sou o **${this.client.user!.username}**! um bot de música e moderação que está em desenvolvimento.`,
                `Fui criado <t:${~~(this.client.user!.createdTimestamp / 1000)}:R> ( <t:${~~(this.client.user!.createdTimestamp / 1000)}:F> )`,
            ].join("\n"))

            embed.addFields([
                {
                    name: "Estatísticas",
                    value: [
                        `🖥️ Servidores: **${allServers.toLocaleString()}**`,
                        `🤖 Usuários: **${allUsers.toLocaleString()}**`,
                        `📚 Shards: **${allShards.toLocaleString()}**`,
                        `🎵 Players: **${allPlayers.toLocaleString()}**`,
                        `💾 Memória: **${this.client.utils.formatBytes(memory.flat(Infinity).reduce((a, b) => a + b, 0))}**`,
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
                url: "https://github.com/eclipse-labs"
            })


            const actionRow = new ActionRowBuilder<ButtonBuilder>()
            actionRow.addComponents([inviteButton, supportButton, sourceButton])

            interaction.followUp({
                embeds: [embed],
                components: [actionRow]
            })
        }
    }
}