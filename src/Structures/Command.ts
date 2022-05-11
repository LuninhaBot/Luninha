import { PermissionResolvable, ChatInputCommandInteraction, Awaitable } from "discord.js"
import type NFTCordClient from "./NFTCordClient"

export default class Command {

    client: NFTCordClient
    name: string
    description: string
    usage: string
    category: string
    userPerms: PermissionResolvable[]
    botPerms: PermissionResolvable[]
    ownerOnly: boolean
    guildOnly: boolean
    ephemeral: boolean

    constructor(client: NFTCordClient) {

        this.client = client
        this.name = "" || "Não definido"
        this.description = "" || "Não definido"
        this.usage = "" || "Não definido"
        this.category = "" || "Não definido"
        this.userPerms = []
        this.botPerms = []
        this.ownerOnly = false
        this.guildOnly = false
        this.ephemeral = false
    }

    async run({ interaction }: runCommand): Promise<Awaitable<any>>  {
        return { interaction }
    }
}

export type runCommand = { interaction: ChatInputCommandInteraction  }