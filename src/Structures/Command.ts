import { PermissionResolvable, ChatInputCommandInteraction, Awaitable } from "discord.js"
import EclipseClient from "./EclipseClient"


export interface CommandOptions {
    name: string
    description: string | "Não definido"
    usage?: string
    category?: string
    userPerms?: PermissionResolvable[]
    botPerms?: PermissionResolvable[]
    ownerOnly?: boolean
    ephemeral?: boolean
    djOnly?: boolean
}

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
    djOnly: boolean

    constructor(client: EclipseClient, options: CommandOptions) {

        this.client = client
        this.name = options.name ?? "Não definido"
        this.description = options.description ?? "Sem descrição"
        this.usage = options.usage ?? ""
        this.category = options.category ?? "Outros"
        this.userPerms = options.userPerms ?? []
        this.botPerms = options.botPerms ?? []
        this.ownerOnly = options.ownerOnly ?? false
        this.ephemeral = options.ephemeral ?? false
        this.djOnly = options.djOnly ?? false
    }

    run({ interaction }: RunCommand): Awaitable<any>  {
        return { interaction }
    }
}

export type RunCommand = { interaction: ChatInputCommandInteraction  }