import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js"
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class BotCommands extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "bot",
            subCommands: ["convite", "info"],
            description: "Veja algumas informações sobre mim.",
            category: "Utilitários"
        })
    }

    async run({ interaction }: RunCommand) {

        if (interaction.options.getSubcommand(true) == "convite") {
            await interaction.deferReply({ fetchReply: false, ephemeral: true })

            this.client.commands.get("bot_invite")!.run({ interaction } as RunCommand)

            return;
        }

        if (interaction.options.getSubcommand(true) == "info") {
            await interaction.deferReply({ fetchReply: true })

            this.client.commands.get("bot_info")!.run({ interaction } as RunCommand)

            return;
        }
    }
}