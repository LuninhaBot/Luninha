import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { EmbedBuilder } from "discord.js"

export default class nowPlayingCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "now",
            description: "Mostra a música que está tocando no momento",
            category: "Música",
            usage: "playing",
        })
    }

    async run({ interaction }: RunCommand) {
        
        /*
         * Esse comando ta funcionando por enquanto? Talvez ele faça puff em breve 
        */

        const player = this.client.music.players.get(interaction.guild?.id ?? "")


        let duration = player?.queue.current?.duration ?? 0
        const parsedCurrentDuration = this.client.utils.formatDuration(player?.position ?? 0)
        const parsedDuration = this.client.utils.formatDuration(player?.queue.current?.duration ?? 0)
        const part = Math.floor((player?.position ?? 0 / duration) * 11)
        const uni = player?.playing ? "▶" : "⏸️"
        // @ts-ignore
        const user = await this.client.users.fetch(player?.queue.current?.requester.id ?? "")
        var sound;

        // @ts-ignore
        if (player?.volume > 50) {
            sound = "🔊"
            // @ts-ignore
        } else if (player?.volume <= 50 && player?.volume !== 0) {
            sound = "🔉"
        } else {
            sound = "🔈"
        }

        let repeat = "▬"?.repeat(part) + "🔘" + "▬"?.repeat((11 - part) ?? part - 11)

        let embed = new EmbedBuilder()
        embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ forceStatic: false }) })
        embed.setDescription(`**[${player?.queue.current?.title}](${player?.queue.current?.uri})**\n${uni} ${repeat} \`${parsedCurrentDuration}/${parsedDuration}\` ${sound}`)
        embed.setFooter({ text: `De ${player?.queue.current?.author}` })
        embed.setColor("#80088b")

        let member = await interaction.guild?.members.fetch(interaction.user.id)
        interaction.followUp({
            content: `**Tocando agora em ${member?.voice.channel?.name}**`,
            embeds: [embed]
        })
    }
}