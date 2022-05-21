import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonStyle, SelectMenuInteraction, ButtonInteraction, ComponentType, Interaction, Message } from "discord.js"
import { SearchResult, Track } from "erela.js"

export default class SearchCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "search",
            description: "Pesquisa uma música e a coloca para tocar",
            category: "Música",
            usage: "<nome>",
        })
    }

    async run({ interaction }: RunCommand) {

        const play = this.client.music.players.get(interaction.guild?.id ?? "")

        let member = await interaction.guild?.members.fetch(interaction.user.id)
        const voice = member?.voice

        if (!voice?.channel) return interaction.followUp(":x: | Você não está em um canal de voz!")

        if (!play) {
            const player = this.client.music.create({
                guild: interaction.guild?.id ?? "",
                voiceChannel: voice.channel?.id ?? "",
                textChannel: interaction.channel?.id ?? "",
                selfDeafen: true
            })

            if (!voice.channel.joinable) {
                return interaction.followUp(":x: | Não consigo entrar no canal de voz solicitado!")
            }

            player.connect()
        }

        const player = this.client.music.players.get(interaction.guild?.id ?? "")

        if (player?.voiceChannel !== voice.channel.id) {
            return interaction.followUp(`:x: | Estou tocando música em \`${interaction.guild?.channels.cache.get(player?.options.voiceChannel ?? "")}\`!`)
        }

        const search = interaction.options.getString("query", true)
        let res: SearchResult;

        try {
            res = await player.search(search, interaction.user)
            if (res.loadType === "LOAD_FAILED") {
                if (!player.queue.current) player.destroy()
                throw new Error(res.exception?.message)
            }
        } catch (err) {
            return interaction.followUp(`:x: | Aconteceu um erro ao tentar tocar a música: \`${err}\``)
        }

        if (res.loadType == "NO_MATCHES") {
            if (!player.queue.current) player.destroy()
            await interaction.followUp(":x: | Não foi possivel encontrar a música!")
        }

        if (res.loadType == "PLAYLIST_LOADED") {
            await interaction.followUp(":x: | Por favor não envie links de playlists!")
            player.destroy()
        }

        if (res.loadType == "TRACK_LOADED") {
            await interaction.followUp(":x: | Por favor não envie links de músicas!")
            player.destroy()
        }

        if (res.loadType == "SEARCH_RESULT") {
            let max = 15
            if (res.tracks.length < max) max = res.tracks.length

            let options = res.tracks.slice(0, max).map(({ title, identifier }) => {
                return { title, identifier }
            })


            const buttonQueue = new ButtonBuilder({
                label: "Clique para ver a lista de músicas",
                customId: "queue",
                emoji: "🎵",
                style: ButtonStyle.Success
            })

            const buttonRow = new ActionRowBuilder<ButtonBuilder>()
            buttonRow.addComponents([buttonQueue])

            let menuOptions = []
            for (const a of options) {
                menuOptions.push({
                    label: a.title.slice(0, 100),
                    value: a.identifier
                })
            }

            const menu = new SelectMenuBuilder({
                placeholder: `${max} músicas encontradas`,
                customId: "musicSelector",
                minValues: 1,
                maxValues: max,
                options: menuOptions,
            })

            const row = new ActionRowBuilder<SelectMenuBuilder>()
            row.addComponents([menu])

            const results = res.tracks
                .slice(0, max)
                .map((track, index) => `**${++index}º** \`[${this.client.utils.formatDuration(track.duration)}]\` **[${track.title}](${track.uri})**`)
                .join("\n")

            let embed3 = new EmbedBuilder()
            embed3.setColor("#80088b")
            embed3.setTimestamp()
            embed3.setDescription(results)

            await interaction.followUp({
                embeds: [embed3],
                components: [row]
            })

            const collector = interaction.channel!.createMessageComponentCollector({
                filter: (i) => ["musicSelector", "queue"].includes(i.customId),
                time: 60000
            })

            let tracks = [] as Track[]

            collector.on("collect", async (i: Interaction) => {
                if (i.isButton() && i.customId == "queue") {

                    if (i.user.id !== interaction.user.id) {
                        i.reply({
                            content: ":x: | Você não pode interagir com a mensagem!",
                            ephemeral: true
                        })
        
                        return;
                    }

                    let embed = new EmbedBuilder()
                    embed.setColor("#80088b")
                    embed.setTimestamp()
                    embed.setDescription(`:white_check_mark: | As seguintes músicas foram adicionadas à fila:\n${tracks.map((track, index) => `**${++index}º** \`[${this.client.utils.formatDuration(track.duration)}]\` **[${track.title}](${track.uri})**`).join("\n")}`)

                    await i.deferReply({ fetchReply: true, ephemeral: true })

                    await i.followUp({
                        embeds: [embed]
                    })

                    collector.stop()
                    return;
                }

                if (i.isSelectMenu()) {

                    if (i.customId == "musicSelector") {

                        if (i.user.id !== interaction.user.id) {
                            i.reply({
                                content: ":x: | Você não pode interagir com a mensagem!",
                                ephemeral: true
                            })

                            return;
                        }

                        for (const id of i.values) {
                            tracks.push(res.tracks.find(t => t.identifier == id) as Track)
                        }

                        player.queue.add(tracks)
                        if (!player.playing && !player.paused && player.queue.totalSize === tracks.length) await player.play()

                        let embed = new EmbedBuilder()
                        embed.setColor("#80088b")
                        embed.setDescription(`:white_check_mark: | Adicionado \`${tracks.length}\` músicas à fila!`)

                        await i.channel!.send({ embeds: [embed], components: [buttonRow] })
                        this.client.music.emit("playingNow", player, player.queue.current, interaction)

                        await i.update({ components: [] })
                    }
                }
            })
        }
    }
}