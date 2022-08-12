import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"

export default class ConfigModLogsSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "config_modlogs",
            category: "Admin",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        const channel = interaction.options.getChannel("canal")

        if (!channel && !db.get(`${interaction.guild?.id}.modlogs`)) {
            interaction.followUp({
                content: ":x: » Você não definiu um canal de logs de moderação!",
            })

            return;
        }

        if (!channel && db.get(`${interaction.guild?.id}.modlogs`)) {
            db.delete(`${interaction.guild?.id}.modlogs`)
            interaction.followUp({
                content: ":white_check_mark: » Canal de logs de moderação removido com sucesso!",
            })

            return;
        }

        db.set(`${interaction.guild?.id}.modlogs`, channel?.id)

        interaction.followUp({
            content: ":white_check_mark: » Canal de logs de moderação definido com sucesso!",
        })
    }
}