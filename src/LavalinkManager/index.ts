import { ChatInputCommandInteraction, EmbedBuilder, TextChannel } from "discord.js"
import { Manager, Player, Track } from "erela.js"
import EclipseClient from "../Structures/EclipseClient"
import config from "../Utils/Config"
import Logger from "../Utils/Logger"
import "./Player"

export default class EclipseLavalink extends Manager {
    client: EclipseClient

    constructor(client: EclipseClient) {
        super({
            nodes: config.lavalink,
            autoPlay: true,
            clientName: "Eclipse",
            send: (id, payload) => {
                const guild = client.guilds.cache.get(id)
                if (guild) guild.shard.send(payload)
            }
        })


        this.client = client

        this.on("nodeConnect", (node) => Logger.ready(`Lavalink Node ${node.options.identifier} connected!`))

        this.on("nodeDisconnect", (node) => Logger.ready(`Lavalink Node ${node.options.identifier} disconnected!`))

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
            embed.setColor("#80088b")

            interaction.followUp({
                embeds: [embed]
            }).catch(() => { }).then(msg => player.set("message", msg))
        })

        // @ts-ignore
        this.on("newTrackStart", (player: Player, tracks: Track[]) => {
            const track = tracks[0]
            const channel = client.channels.cache.get(player.textChannel ?? "") as TextChannel

            let embed = new EmbedBuilder()
            embed.setColor("#80088b")
            embed.setDescription(`:musical_note: | Tocando agora **${track.title}**`)

            channel.send({
                embeds: [embed]
            })
        })

        this.on("trackError", async (player, track, payload) => {
            const channel = this.client.channels.cache.get(player.textChannel ?? "") as TextChannel

            channel.send({
                content: `:x: | Encontrei um erro ao tocar o track ${track.title}\n\`\`\`${payload.error}\`\`\``
            })
        })

        this.on("queueEnd", async (player, track) => {
            const channel = this.client.channels.cache.get(player.textChannel ?? "") as TextChannel

            channel.send({
                content: "👋 | A fila de reprodução acabou!",
            })

            player.destroy()
        })
    }
}