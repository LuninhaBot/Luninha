import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class InviteCommand extends Command {
    constructor(client: EclipseClient) {
        super(client)
        this.name = "bot"
        this.usage = "info | invite"
        this.description = "...?"
        this.category = "Outros"
    }

    async run({ interaction }: RunCommand) {

        let subCommand = interaction.options.getSubcommand(false)

        if (subCommand == "invite") {
            interaction.followUp({
                content: "Que bom que gostou das minhas funcionalidades -> [Convite aqui](https://discord.com/api/oauth2/authorize?client_id=683040461434388501&permissions=8&scope=bot%20applications.commands)",
                ephemeral: true
            })

            return;
        }

        if (subCommand == "info") {
            return;
        }
    }
}