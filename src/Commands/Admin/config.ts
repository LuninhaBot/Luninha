import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class djCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "config",
            description: "Defina o cargo de DJ do servidor!",
            subCommands: ["dj"],
            category: "Admin"
        })
    }

    async run({ interaction }: RunCommand) {

        if (interaction.options.getSubcommand(true) == "dj") {

            let role = interaction.options.getRole("cargo", false)


            if (!role && !db.getData(`/${interaction.guild?.id}/dj`)) {
                interaction.followUp({
                    content: ":x: | Você não tem cargo de DJ definido!",
                })
                return;
            }

            if (!role && db.getData(`/${interaction.guild?.id}/dj`)) {
                db.push(`/${interaction.guild?.id}/dj`, { dj: null })
                interaction.followUp({
                    content: ":white_check_mark: | Cargo de DJ removido com sucesso!",
                })
                return;
            }

            if (role) {
                db.push(`/${interaction.guild?.id}/dj`, role.id)
                interaction.followUp({
                    content: ":white_check_mark: | Cargo de DJ definido com sucesso!",
                })
                return;
            }
        }
    }
}