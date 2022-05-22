import { Options } from "discord.js";
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class ShuffleCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "volume",
            description: "Define ou mostra o volume",
            usage: "[0-100]",
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.music.players.get(interaction.guild?.id ?? "")
        const nvolume = player?.volume
    
        var sound;
        if (player?.volume ?? 100 > 50) {
            sound = "🔊"
            // @ts-ignore
        } else if (player?.volume <= 50 && player?.volume  !== 0) {
            sound = "🔉"
        } else {
            sound = "🔈"
        }

        if (!interaction.options.getNumber("volume")) {
            interaction.followUp({
                content: `${sound} | Volume atual é \`${nvolume}\``
            })

            return;
        }

        if (interaction.options.getNumber("volume", true) < 0 || interaction.options.getNumber("volume", true) > 150) {
            interaction.followUp({
                content: ":x: | O volume deve ser um número válido entre 0 e 150!"
            })

            return;
        }

        player?.setVolume(interaction.options.getNumber("volume", true))

        interaction.followUp({
            content: `${sound} | Volume definido de \`${nvolume}\` para \`${interaction.options.getNumber("volume", true)}\``
        })
    }
}