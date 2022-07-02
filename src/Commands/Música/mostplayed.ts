import { EmbedBuilder } from "discord.js"
import EclipseClient from "../../Structures/EclipseClient"
import Command, { RunCommand } from "../../Structures/Command"

export default class MostPlayedCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "most",
            category: "Música",
            description: "Mostra as 10 músicas mais tocadas",
            subCommands: ["played"],
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ fetchReply: true })

        const embed = new EmbedBuilder()
        embed.setColor("#04c4e4")
        embed.setTitle("Músicas mais tocadas")

        let sort = mostPlayed.all().sort((a, b) => b.data.playedCount - a.data.playedCount)
        let allPlayed = mostPlayed.all().map(x => x.data.playedCount).reduce((a, b) => a + b, 0)
        let songsArray = []
        for (const data of sort) {
            songsArray.push(`**${data.data.playedCount}º** [\`${data.data.title}\`](${data.data.url})`)
        }

        embed.setDescription(songsArray.slice(0, 10).join("\n"))
        embed.setFooter({ text: `Nesse mês eu reproduzi ${allPlayed.toLocaleString()} músicas` })
        interaction.followUp({
            embeds: [embed]
        })
    }
}