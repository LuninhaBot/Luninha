import Command, { RunCommand } from "../../../Structures/Command"
import EclipseClient from "../../../Structures/EclipseClient"

export default class LoopTrackSubCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "loop_track",
            category: "DJ",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.music.players.get(interaction.guild!.id)

        if (!player) { 

            interaction.followUp({
                content: ":x: | Não tem nenhuma música tocando no momento."
            })

            return;
        }

        player.setTrackRepeat(!player.trackRepeat)

        await interaction.followUp({
            content: `:white_check_mark: | Loop de música ${player.trackRepeat ? "**ATIVADO**" : "**DESATIVADO**"}.`
        })

    }
}
