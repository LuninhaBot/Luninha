import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class ShuffleCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "shuffle",
            description: "Embaralha a fila de música.",
            category: "DJ",
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const player = this.client.music.players.get(interaction.guild!.id)
        if (player?.queue.length == 0) {
            interaction.followUp({
                content: `:x: | Não tem nenhuma música na fila para embaralhar!`
            })

            return;
        }

        player?.queue.shuffle()

        interaction.followUp({
            content: `✅ | Embaralhado com sucesso ${player?.queue.length} músicas.`
        })
    }
}