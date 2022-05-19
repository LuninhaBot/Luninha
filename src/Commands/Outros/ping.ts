import Command from "../../Structures/Command"
import type EclipseClient from "../../Structures/EclipseClient"
import type { RunCommand } from "../../Structures/Command"
import { table } from "table"

export default class PingCommand extends Command {
    constructor(client: EclipseClient) {
        super(client)
        this.name = "ping"
        this.category = "Outros"
        this.description = "Mostra o ping do bot"
        this.ownerOnly = false
    }

    async run({ interaction }: RunCommand) {
        const start = Date.now()
        await interaction.followUp({ content: "🏓" })
        const apiPing = Date.now() - start

        await interaction.editReply({
            content: `**Pong!** Meu ping é de \`${this.client.ws.ping}ms\`. A latencia da API é \`${apiPing}ms\`\n**Uptime:** ${this.client.utils.time(this.client?.uptime ?? 0)}`
        })
    }
}