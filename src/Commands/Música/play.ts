import { ChannelType, EmbedBuilder, GuildMember } from "discord.js"
import { SearchResult } from "erela.js"
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { LavalinkPlayer } from "../../LavalinkManager/Player"

export default class PlayCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "play",
            description: "Adiciona uma música à fila de espera.",
            usage: "<link | playlist | nome>",
            category: "Música"
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })
        
        const play = this.client.music.players.get(interaction.guild!.id)

        let member = interaction.member as GuildMember
        const voice = member.voice

        if (!voice.channel) {
            interaction.followUp({
                content: ":x: | Você não está em um canal de voz!"
            })
            return;
        }

        if (!play) {
            const player = new LavalinkPlayer({
                guild: interaction.guild!.id,
                voiceChannel: voice.channel!.id,
                textChannel: interaction.channel!.id,
                selfDeafen: true,
            })

            if (!voice.channel.joinable) {
                interaction.followUp({
                    content: ":x: | Não consigo entrar no canal de voz solicitado!" 
                })

                return;
            }

            player.connect()
        }

        const player = this.client.music.players.get(interaction.guild!.id) as LavalinkPlayer

        if (player?.voiceChannel !== voice.channel.id) {
            interaction.followUp(`:x: | Estou tocando música em \`${interaction.guild?.channels.cache.get(player?.options.voiceChannel ?? "")?.name}\`!`)
            return;
        }

        const search = interaction.options.getString("query", true)
        let res: SearchResult;

        try {
            res = await player.search(search, interaction.user)

            if (res.loadType == "LOAD_FAILED") {
                if (!player.queue.current) player.destroy()
                throw new Error(res.exception?.message)
            }

        } catch (err) {
            if (!player.queue.current) player.destroy()
            return interaction.followUp(`:x: | Aconteceu um erro ao tentar tocar a música: \`${err}\``)
        }

        let embed = new EmbedBuilder()
        let embed2 = new EmbedBuilder()

        if (res.loadType == "NO_MATCHES") {
            if (!player.queue.current) player.destroy()
            interaction.followUp(":x: | Não foi possivel encontrar nenhuma música!")

            return;
        }

        if (res.loadType == "TRACK_LOADED") {

            player.queue.add(res.tracks[0])

            if (!player.playing && !player.paused && !player.queue.size) player.play()

			if (player.queue.size >= 1) {
                let embed = new EmbedBuilder()
                embed.setColor("#04c4e4")
                embed.setDescription(`:musical_note: | Adicionado a lista de espera **${res.tracks[0].title}**`)

				interaction.followUp({
					embeds: [embed],
				})

                return;
                
			} else {
				this.client.music.emit("playingNow", player, res.tracks[0], interaction)

                return;
			}
        }

        if (res.loadType == "PLAYLIST_LOADED") {

            player.queue.add(res.tracks)

            if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play()

            if (player.queue.size >= 1) {
                embed2.setColor("#04c4e4")
                embed2.setDescription(`:musical_note: | Adicionado a fila de espera a playlist **${res.playlist?.name}**`)
    
                interaction.followUp({
                    embeds: [embed2]
                })
            } else {
                this.client.music.emit("playingNow", player, res.tracks[0], interaction)
            }

            return;
        }

        if (res.loadType == "SEARCH_RESULT") {

            player.queue.add(res.tracks[0])

            if (!player.playing && !player.paused && !player.queue.length) player.play()

            embed.setColor("#04c4e4")
            embed.setDescription(`:musical_note: | Adicionado a lista de espera **${res.tracks[0].title}**`)

			if (player.queue.size >= 1) {

				interaction.followUp({
					embeds: [embed]
				})

                return;
			} else {
				this.client.music.emit("playingNow", player, res.tracks[0], interaction)

                return;
			}
        }
    }
}