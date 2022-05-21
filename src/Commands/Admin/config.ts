import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class djCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "config",
            description: "Defina o cargo de DJ do servidor!",
            usage: "dj",
            category: "Admin"
        })
    }

    async run({ interaction }: RunCommand) {

        if (interaction.options.getSubcommand(true) == "dj") {

            let role = interaction.options.getRole("cargo", false)

            if (!role && !db.get(`dj_${interaction.guild?.id}`)) {
                interaction.followUp({
                    content: ":x: | Você não tem cargo de DJ definido!",
                })
                return;
            }

            if (!role && db.get(`dj_${interaction.guild?.id}`)) {
                db.delete(`dj_${interaction.guild?.id}`)
                interaction.followUp({
                    content: ":white_check_mark: | Cargo de DJ removido com sucesso!",
                })
                return;
            }

            if (role) {
                db.set(`dj_${interaction.guild?.id}`, role.id)
                interaction.followUp({
                    content: ":white_check_mark: | Cargo de DJ definido com sucesso!",
                })
                return;
            }
        }
    }
}