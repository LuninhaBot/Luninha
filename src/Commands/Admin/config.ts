import { EmbedBuilder } from "discord.js"
import Command, { RunCommand } from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"
import { PermissionFlagsBits } from "discord.js"

export default class ConfigCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "config",
            description: "Configura algumas coisas do bot.",
            userPerms: [
                PermissionFlagsBits.ManageGuild,
                PermissionFlagsBits.ManageChannels
            ],
            subCommands: ["dj", "autorole", "modlogs", "view"],
            category: "Admin",
            marks: {
                updated: true
            }
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        if (interaction.options.getSubcommand(true) == "autorole") {
            this.client.commands.get("config_autorole")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "dj") {
            this.client.commands.get("config_dj")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "modlogs") {
            this.client.commands.get("config_modlogs")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "view") {
            this.client.commands.get("config_view")!.run({ interaction } as RunCommand)

            return;
        }
    }
}