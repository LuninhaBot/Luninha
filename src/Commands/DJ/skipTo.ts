import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class ForceSkipCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "skipto",
            description: "Pula para uma música especifica",
            usage: "<posição>",
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {
        const player = this.client.music.players.get(interaction.guild?.id ?? "")

        let arg = interaction.options.getNumber("posição", true)

        // @ts-ignore
        if (arg > player?.queue.totalSize || (arg && !player?.queue[arg - 1])) {
            interaction.followUp({
                content: `:x: | A posição deve ser um número entre 1 e ${player?.queue.totalSize}`
            })
            return;
        }

        const song = player?.queue[arg - 1].title

        if (arg == 1) player?.stop()
        player?.queue.splice(0, arg - 1)
        player?.stop()
        
        interaction.followUp({
            content: `✅ | Pulado para **${song}**`
        })
    }
}