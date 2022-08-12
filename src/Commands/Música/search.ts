import Command, { RunCommand } from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"
import { LavalinkPlayer } from "../../LavalinkManager/Player"
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonStyle, SelectMenuInteraction, ButtonInteraction, ComponentType, Interaction, Message, VoiceState, ChannelType } from "discord.js"
import { SearchResult, Track } from "erela.js"
import fetch from "node-fetch"

export default class SearchCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "search",
            description: "Pesquisa uma música e a coloca para tocar.",
            category: "Música",
            usage: "<nome>",
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const member = await interaction.guild?.members.fetch(interaction.user.id)
        const { channel } = member?.voice as VoiceState

        if (!channel) {
            interaction.followUp({
                content: ":x: | Você não está em um canal de voz."
            })

            return;
        }

        if (!this.client.music.players.get(interaction.guild!.id)) {

            if (!channel.joinable) {

                interaction.followUp({
                    content: ":x: » Não consigo entrar no canal de voz solicitado!" 
                })

                return;
            }

            new LavalinkPlayer({
                guild: interaction.guild!.id,
                voiceChannel: channel!.id,
                textChannel: interaction.channel!.id,
                selfDeafen: true
            }).connect()

            if (channel.type == ChannelType.GuildStageVoice) {
                await fetch(`https://discord.com/api/v10/guilds/${interaction.guild!.id}/voice-states/@me`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bot ${this.client.token}`,
                    },
                    body: JSON.stringify({ 
                        channel_id: channel.id,
                        suppress: false 
                    })
                })
            }
        }

        const player = this.client.music.players.get(interaction.guild!.id) as LavalinkPlayer

        if (player?.voiceChannel !== channel.id) {
            interaction.followUp(`:x: » Estou tocando música em \`${interaction.guild?.channels.cache.get(player?.options.voiceChannel ?? "")}\``)

            return;
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
            interaction.followUp(`:x: » Aconteceu um erro ao tentar tocar a música: \`${err}\``)

            return;
        }

        if (res.loadType == "NO_MATCHES") {
            if (!player.queue.current) player.destroy()
            interaction.followUp(":x: » Não foi possivel encontrar nenhuma música.")

            return;
        }

        if (res.loadType == "PLAYLIST_LOADED") {
            interaction.followUp(":x: » Por favor não envie links de playlists.")
            player.destroy()

            return;
        }

        if (res.loadType == "TRACK_LOADED") {
            interaction.followUp(":x: » Por favor não envie links de músicas.")
            player.destroy()

            return;
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

            const embed = new EmbedBuilder()
            embed.setColor(this.client.defaultColor)
            embed.setTimestamp()
            embed.setDescription(results)

            interaction.followUp({
                embeds: [embed],
                components: [row]
            })

            const collector = interaction.channel!.createMessageComponentCollector({
                filter: (i) => {
                    if (["musicSelector", "queue"].includes(i.customId)) {
                        if (i.user.id !== interaction.user.id) {
                            i.reply(":x: | Apenas o autor pode usar essas interaçoes.")
                            return false
                        }
                        return true
                    }
                    return false
                },
                time: 60000
            })

            const tracks = [] as Track[]
            let msg: Message;

            collector.on("collect", async (i) => {
                if (i.isButton() && i.customId == "queue") {

                    const embed = new EmbedBuilder()
                    embed.setColor(this.client.defaultColor)
                    embed.setTimestamp()
                    embed.setDescription(`:white_check_mark: » As seguintes músicas foram adicionadas à fila:\n${tracks.map((track, index) => `**${++index}º** \`[${this.client.utils.formatDuration(track.duration)}]\` **[${track.title}](${track.uri})**`).join("\n")}`)

                    i.reply({
                        embeds: [embed]
                    })
                    
                    msg.edit({
                        components: []
                    }).catch(() => { })


                    collector.stop()
                    return;
                }

                if (i.isSelectMenu() && i.customId == "musicSelector") {

                    await i.deferUpdate()

                    for (const id of i.values) {
                        tracks.push(res.tracks.find(t => t.identifier == id) as Track)
                    }

                    player.queue.add(tracks)
                    if (!player.playing && !player.paused && player.queue.totalSize === tracks.length) await player.play()

                    const embed = new EmbedBuilder()
                    embed.setColor(this.client.defaultColor)
                    embed.setDescription(`:white_check_mark: » Adicionado \`${tracks.length}\` músicas à fila.`)

                    msg = await i.channel!.send({ embeds: [embed], components: [buttonRow] })
                    this.client.music.emit("playingNow", player, player.queue.current, interaction)

                    i.editReply({ components: [] })

                    return;
                }
            })

            collector.on("end", () => {
                msg.edit({
                    components: []
                }).catch(() => { })
            })
        }
    }
}