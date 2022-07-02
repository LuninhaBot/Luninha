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

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        if (interaction.options.getSubcommand(true) == "dj") {

            let role = interaction.options.getRole("cargo", false)


            if (!role && !db.get(`${interaction.guild?.id}.dj`)) {
                interaction.followUp({
                    content: ":x: | Você não tem cargo de DJ definido!",
                })
                return;
            }

            if (!role && db.get(`${interaction.guild?.id}.dj`)) {
                db.delete(`${interaction.guild?.id}.dj`)
                interaction.followUp({
                    content: ":white_check_mark: | Cargo de DJ removido com sucesso!",
                })
                return;
            }

            if (role) {
                db.set(`${interaction.guild?.id}.dj`, role.id)
                interaction.followUp({
                    content: ":white_check_mark: | Cargo de DJ definido com sucesso!",
                })
                return;
            }
        }
    }
}