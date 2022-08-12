import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"

export default class LoopQueueSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "loop_queue",
            category: "DJ",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        const player = this.client.music.players.get(interaction.guild!.id)

        if (!player) { 

            interaction.followUp({
                content: ":x: » Não tem nenhuma música tocando no momento."
            })

            return;
        }

        player.setQueueRepeat(!player.queueRepeat)

        await interaction.followUp({
            content: `:white_check_mark: » Loop de fila ${player.queueRepeat ? "**ATIVADO**" : "**DESATIVADO**"}.`
        })

    }
}