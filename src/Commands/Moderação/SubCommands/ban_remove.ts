import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"

export default class BanRemoveSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "ban_remove",
            description: "Remove um banimento do servidor.",
            category: "Moderação",
            showInHelp: false,
        })
    }

    async run({ interaction }: RunCommand) {
        const id = interaction.options.getString("id", true)
    
        const ban = await interaction.guild!.bans.fetch(id).catch(() => { })

        if (!ban) {
            interaction.followUp(`:x: » Este usuário não está banido!`)

            return;
        }

        await interaction.guild!.bans.remove(id, interaction.options.getString("motivo") ?? "Nenhum motivo informado").catch(() => { })

        interaction.followUp(`✅ » Banimento removido com sucesso!`)

        return;
    }
}