import Command, { RunCommand } from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"
import { PermissionFlagsBits } from "discord.js"

export default class BanCommands extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "ban",
            description: "Banir um usuário do servidor.",
            category: "Moderação",
            usage: "<usuário> [motivo]",
            userPerms: [
                PermissionFlagsBits.BanMembers
            ],
            botPerms: [
                PermissionFlagsBits.BanMembers
            ],
            subCommands: ["user", "info", "remove", "list"]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ fetchReply: true })


        if (interaction.options.getSubcommand(true) == "user") {
            this.client.commands.get("ban_user")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "info") {
            this.client.commands.get("ban_info")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "list") {
            this.client.commands.get("ban_list")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "remove") {
            this.client.commands.get("ban_remove")!.run({ interaction } as RunCommand)

            return;
        }
    }
}