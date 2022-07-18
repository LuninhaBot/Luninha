import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class djCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "config",
            description: "Defina o cargo de DJ do servidor!",
            subCommands: ["dj", "autorole"],
            category: "Admin"
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        if (interaction.options.getSubcommand(true) == "dj") {

            const role = interaction.options.getRole("cargo", false)


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

        if (interaction.options.getSubcommand(true) == "autorole") {
            const arrayRoles = []
			arrayRoles.push(
                interaction.options.getRole("cargo1")?.id,
                interaction.options.getRole("cargo2")?.id,
                interaction.options.getRole("cargo3")?.id,
                interaction.options.getRole("cargo4")?.id,
                interaction.options.getRole("cargo5")?.id,
            )

            const filter = arrayRoles.filter(r => typeof r !== "undefined")

            if (filter.length == 0 && !db.get(`${interaction.guild?.id}.autorole`)) {
                interaction.followUp({
                    content: ":x: | Você não definiu nenhum cargo para o autorole!",
                })

                return;
            }

            if (filter.length == 0 && db.get(`${interaction.guild?.id}.autorole`)) {
                db.delete(`${interaction.guild?.id}.autorole`)
                interaction.followUp({
                    content: ":white_check_mark: | Cargo de autorole removido com sucesso!",
                })

                return;
            }

            db.set(`${interaction.guild?.id}.autorole`, arrayRoles.filter(r => typeof r !== "undefined"))
            interaction.followUp({
                content: ":white_check_mark: | Autorole definido com sucesso!",
            })

            
        }
    }
}