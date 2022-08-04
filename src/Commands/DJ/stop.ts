import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class StopCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "stop",
            description: "Para de tocar as músicas no servidor.",
            category: "DJ",
            djOnly: true,
            marks: {
                isNew: true
            }
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.music.players.get(interaction.guild!.id)

        if (!player) {
            await interaction.deferReply({ ephemeral: true })

            interaction.followUp(":x: | Não há nada tocando nada no momento.")

            return;
        }

        player.stop()

        await interaction.deferReply({ ephemeral: false })
        interaction.followUp({
            content: ":white_check_mark: | Parei de tocar e a fila de música foi limpa."
        })
    }
}