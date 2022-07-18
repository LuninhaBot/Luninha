import { ChatInputCommandInteraction, EmbedBuilder, TextChannel } from "discord.js"
import { Manager, Player, Track } from "erela.js"
import EclipseClient from "../Structures/EclipseClient"
import { lavalink } from "../Utils/Config"
import Logger from "../Utils/Logger"

export default class EclipseLavalink extends Manager {

    constructor(client: EclipseClient) {
        super({
            nodes: lavalink,
            autoPlay: true,
            clientName: "Eclipse",
            send: (id, payload) => {
                const guild = client.guilds.cache.get(id)
                if (guild) guild.shard.send(payload)
            }
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
            embed.setColor("#04c4e4")

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
            embed.setColor("#04c4e4")
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