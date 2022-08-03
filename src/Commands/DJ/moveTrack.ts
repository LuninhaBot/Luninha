import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class MoveTrackCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "move",
            description: "Move uma música da fila atual para uma posição diferente.",
            subCommands: ["track"],
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const player = this.client.music.players.get(interaction.guild!.id)

        let options = {
            from: interaction.options.getNumber("de", true),
            to: interaction.options.getNumber("para", true)
        }

        // @ts-ignore
        if ((options.from > player?.queue.totalSize) && (options.from && !player?.queue[options.from])) {
            interaction.followUp({
                content: `:x: | ${options.from} não é uma posição valida na fila de música!`
            })
        }

        // @ts-ignore
        if ((options.now > player?.queue.totalSize) && (options.from && !player?.queue[options.to])) {
            interaction.followUp({
                content: `:x: | ${options.to} não é uma posição valida na fila de música!`
            })
            return;
        }

        if (options.to == 0) {
            interaction.followUp({
                content: `:x: | Não é possível mover uma música que já esteja tocando. Para pular a música que está tocando, digite: \`/skip\``
            })
            return;
        }

        const song = player?.queue[options.from - 1]

        player?.queue.splice(options.from - 1, 1)
        // @ts-ignore
        player?.queue.splice(options.to - 1, 0, song)
        interaction.followUp({
            content: `✅ | Movido **${song?.title}** de \`${options.from}\` para \`${options.to}\``
        })
    }
}