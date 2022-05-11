import Command from "../../Structures/Command"
import type NFTCordClient from "../../Structures/NFTCordClient"
import type { runCommand } from "../../Structures/Command"

export default class PingCommand extends Command {
    constructor(client: NFTCordClient) {
        super(client)
        this.name = "ping"
        this.category = "Outros"
        this.description = "Mostra o ping do bot"
        this.ownerOnly = false
    }

    async run({ interaction }: runCommand) {
        await interaction.followUp({ content: "🏓" })

        await interaction.editReply({
            content: `**Pong!** Meu ping é de \`${this.client.ws.ping}ms\`. A latencia da API é \`${Date.now() - interaction.createdTimestamp}ms\`\n**Uptime:** ${this.client.utils.time(this.client?.uptime || 0)}`
        })
    }
}