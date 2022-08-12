import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"

export default class ConfigDjSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "config_dj",
            category: "Admin",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        const role = interaction.options.getRole("cargo", false)


        if (!role && !db.get(`${interaction.guild?.id}.dj`)) {
            interaction.followUp({
                content: ":x: » Você não tem cargo de DJ definido!",
            })
            return;
        }

        if (!role && db.get(`${interaction.guild?.id}.dj`)) {
            db.delete(`${interaction.guild?.id}.dj`)
            interaction.followUp({
                content: ":white_check_mark: » Cargo de DJ removido com sucesso!",
            })
            return;
        }

        if (role) {
            db.set(`${interaction.guild?.id}.dj`, role.id)
            interaction.followUp({
                content: ":white_check_mark: » Cargo de DJ definido com sucesso!",
            })

            return;
        }
    }
}