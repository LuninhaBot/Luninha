import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"

export default class ConfigAutoRoleSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "config_autorole",
            category: "Admin",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

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
                content: ":x: » Você não definiu nenhum cargo para o autorole!",
            })

            return;
        }

        if (filter.length == 0 && db.get(`${interaction.guild?.id}.autorole`)) {
            db.delete(`${interaction.guild?.id}.autorole`)
            interaction.followUp({
                content: ":white_check_mark: » Cargo de autorole removido com sucesso!",
            })

            return;
        }

        db.set(`${interaction.guild?.id}.autorole`, arrayRoles.filter(r => typeof r !== "undefined"))
        interaction.followUp({
            content: ":white_check_mark: » Autorole definido com sucesso!",
        })
    }
}