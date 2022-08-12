import Command, { RunCommand } from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"

export default class LoopCommands extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "loop",
            description: "Readiciona músicas a fila depois de tocadas.",
            category: "DJ",
            subCommands: [
                "queue",
                "track"
            ],
            marks: {
                isNew: true 
            },
            djOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })
            
        if (interaction.options.getSubcommand(true) == "track") {
            this.client.commands.get("loop_track")!.run({ interaction } as RunCommand)

            return;
        }
    
        if (interaction.options.getSubcommand(true) == "queue") {
            this.client.commands.get("loop_queue")!.run({ interaction } as RunCommand)

            return;
        }
    }
}
