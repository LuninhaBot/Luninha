import { ChatInputCommandInteraction, EmbedBuilder, TextChannel } from "discord.js"
import { Manager, Player, Track } from "erela.js"
import SpotifyPlugin from "better-erela.js-spotify"
import LuninhaClient from "../../Structures/LuninhaClient"
import { LavaLink, Spotify } from "../Utils/Config"
import Logger from "../Utils/Logger"

export default class EclipseLavalink extends Manager {

    constructor(client: LuninhaClient) {
        super({
            nodes: LavaLink,
            autoPlay: true,
            clientName: "Eclipse",
            send: (id, payload) => {
                const guild = client.guilds.cache.get(id)
                if (guild) guild.shard.send(payload)
            },
            plugins: [
                new SpotifyPlugin({ 
                    albumPageLimit: 10,
                    showPageLimit: 10,
                    playlistPageLimit: 10,
                    cacheTrack: true,
                    countryMarket: "BR",
                    clientId: Spotify.clientId,
                    clientSecret: Spotify.clientSecret
                })
            ]
        })

        this.on("nodeConnect", (node) => Logger.ready(`Lavalink Node ${node.options.identifier} connected!`))

        this.on("nodeError", (node, err) => Logger.error(`Lavalink Node ${node.options.identifier} found an error: ${err}`))

        this.on("trackEnd", (player) => {
            this.emit("newTrackStart", player, [player.queue.current, ...player.queue])
            // @ts-expect-error
            player.get("message").delete().catch(() => { })
        })

        this.on("socketClosed", (player, payload) => {
            if (payload?.byRemote) {
                return player.destroy()
            }
        })

        // @ts-ignore
        this.on("playingNow", (player: Player, track: Track, interaction: ChatInputCommandInteraction) => {
            let embed = new EmbedBuilder()
            embed.setDescription(`:musical_note: | Tocando agora **${track.title}**`)
            embed.setColor(client.defaultColor)

            mostPlayed.set(track.identifier, {
                title: track.title,
                playedCount: mostPlayed.get(track.identifier)?.playedCount + 1 || 1,
                url: track.uri
            })

            interaction.followUp({
                embeds: [embed]
            }).catch(() => { }).then(msg => player.set("message", msg))
        })

        // @ts-ignore
        this.on("newTrackStart", (player: Player, tracks: Track[]) => {
            const track = tracks[0]
            const channel = client.channels.cache.get(player.textChannel ?? "") as TextChannel

            mostPlayed.set(track.identifier, {
                title: track.title,
                playedCount: mostPlayed.get(track.identifier)?.playedCount + 1 || 1,
                url: track.uri
            })

            let embed = new EmbedBuilder()
            embed.setColor(client.defaultColor)
            embed.setDescription(`:musical_note: | Tocando agora **${track.title}**`)

            channel.send({
                embeds: [embed]
            }).then(msg => player.set("message", msg))
        })

        this.on("trackError", async (player, track, payload) => {
            const channel = client.channels.cache.get(player.textChannel ?? "") as TextChannel

            channel.send({
                content: `:x: | Encontrei um erro ao tocar a música **${track.title}**\n\`\`\`${payload.error}\`\`\``
            })
        })

        this.on("queueEnd", async (player, track) => {
            const channel = client.channels.cache.get(player.textChannel ?? "") as TextChannel

            channel.send({
                content: "👋 | A fila de reprodução acabou!",
            })

            player.destroy()
        })
    }
}