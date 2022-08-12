import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"

export default class BotInviteSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "bot_invite",
            category: "Utilitários",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        interaction.followUp({
            content: "<:owoPoiHappy:1007511781930962974> » Que bom que gostou das minhas funcionalidades -> [Convite aqui](https://discord.com/api/oauth2/authorize?client_id=683040461434388501&permissions=8&scope=bot%20applications.commands)",
            ephemeral: true
        })

        return;
    }
}