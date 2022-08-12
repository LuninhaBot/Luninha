import Command, { RunCommand } from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"

export default class UserCommands extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "user",
            description: "Mostra algumas coisas uteis sobre um usuário.",
            category: "Utilitários",
            subCommands: ["info", "banner", "avatar"]
        })
    }

    async run({ interaction }: RunCommand) {

        if (interaction.options.getSubcommand(true) == "info") {

            await interaction.deferReply({ ephemeral: false, fetchReply: true })

            this.client.commands.get("user_info")!.run({ interaction })

            return;
        }

        if (interaction.options.getSubcommand(true) == "banner") {

            this.client.commands.get("user_banner")!.run({ interaction })

            return;
        }

        if (interaction.options.getSubcommand(true) == "avatar") {

            await interaction.deferReply({ ephemeral: false, fetchReply: true })

            this.client.commands.get("user_avatar")!.run({ interaction })

            return;
        }
    }
}