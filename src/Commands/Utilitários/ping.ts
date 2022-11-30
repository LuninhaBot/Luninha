import Command from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"
import { RunCommand } from "../../Structures/Command"

export default class PingCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "ping",
            category: "Utilitários",
            description: "Mostra o ping e o uptime."
        })
    }

    async run({ interaction }: RunCommand) {
        await interaction.deferReply({ ephemeral: true, fetchReply: true })

        const msg = await interaction.followUp({ content: "🏓" })

        await interaction.editReply({
            content: [
                `💗 ${msg.createdTimestamp - interaction.createdTimestamp}ms`,
                `🏓 ${this.client.ws.ping}ms`
            ].join("\n")
        })
    }
}