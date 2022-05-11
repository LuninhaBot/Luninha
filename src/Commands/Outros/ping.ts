import Command from "../../Structures/Command"
import type NFTCordClient from "../../Structures/NFTCordClient"
import type { runCommand } from "../../Structures/Command"

export default class PingCommand extends Command {
    constructor(client: NFTCordClient) {
        super(client)
        this.name = "ping"
        this.description = "Mostra o ping do bot"
        this.ownerOnly = false
    }

    async run({ interaction }: runCommand) {
        interaction.followUp({
            content: `:ping_pong: | ${this.client.ws.ping}ms`,
        })
    }
}