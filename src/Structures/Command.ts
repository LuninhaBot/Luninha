import { PermissionResolvable, ChatInputCommandInteraction, Awaitable } from "discord.js"
import EclipseClient from "./EclipseClient"

export default class Command {

    client: EclipseClient
    name: string
    description: string
    usage: string
    category: string
    userPerms: PermissionResolvable[]
    botPerms: PermissionResolvable[]
    ownerOnly: boolean
    ephemeral: boolean

    constructor(client: EclipseClient) {

        this.client = client
        this.name = "" || "Não definido"
        this.description = "" || "Sem descrição"
        this.usage = ""
        this.category = "" || "Outros"
        this.userPerms = []
        this.botPerms = []
        this.ownerOnly = false
        this.ephemeral = false
    }

    async run({ interaction }: runCommand): Promise<Awaitable<any>>  {
        return { interaction }
    }
}

export type runCommand = { interaction: ChatInputCommandInteraction  }