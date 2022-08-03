import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { geniusToken } from "../../Utils/Config"
import { EmbedBuilder } from "discord.js"
import { Client } from "genius-lyrics"

export default class LyricsCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "lyrics",
            category: "Música",
            description: "Mostra as letras de uma música.",
            usage: "[nome da música]",
        })
    }

    async run({ interaction }: RunCommand) {
        await interaction.deferReply({ ephemeral: false, fetchReply: true })
        
        const client = new Client(geniusToken)

        const player = this.client.music.players.get(interaction.guild?.id ?? "")

        if (!player && !interaction.options.getString("query")) return interaction.followUp(":x: | Não tem nada tocando no servidor!")

        let song = interaction.options.getString("query", false) ?? player?.queue.current?.title

        try {
            await client.songs.search(song ?? "")
        } catch (e) {
            interaction.followUp({
                content: `:x: | Não foi localizado músicas!`
            })

            return;
        }

        const searches = await client.songs.search(song ?? "")
        try {
            await searches[0].lyrics()
        } catch (e) {
            interaction.followUp({
                content: `:x: | Não foi possível encontrar letras para a música \`${song}\`!`
            })

            return;
        }

        const lyrics = await searches[0].lyrics()

        let embed = new EmbedBuilder()
        embed.setColor("#04c4e4")
        embed.setDescription(lyrics.slice(0, 2044) + "...")

        interaction.followUp({
            content: `✅ | Letra de **${searches[0].fullTitle}**:`,
            embeds: [embed]
        })
    }
}