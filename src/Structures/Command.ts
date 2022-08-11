import { PermissionResolvable, ChatInputCommandInteraction, Awaitable, AutocompleteInteraction } from "discord.js"
import EclipseClient from "./EclipseClient"


interface CommandOptions {
    name: string
    description?: string
    subCommands?: unknown[]
    usage?: string
    category?: string
    userPerms?: PermissionResolvable[]
    botPerms?: PermissionResolvable[]
    ownerOnly?: boolean
    ephemeral?: boolean
    djOnly?: boolean
    marks?: { beta?: boolean, updated?: boolean, isNew?: boolean }
    showInHelp?: boolean
}

export default class Command {
    client: EclipseClient
    name: string
    description?: string
    subCommands?: unknown[]
    usage?: string
    category: string
    userPerms: PermissionResolvable[]
    botPerms: PermissionResolvable[]
    ownerOnly: boolean
    ephemeral: boolean
    djOnly: boolean
    marks?: { beta?: boolean, updated?: boolean, isNew?: boolean }
    showInHelp?: boolean

    constructor(client: EclipseClient, options: CommandOptions) {

        this.client = client
        this.name = options.name ?? "Não definido"
        this.description = options.description ?? "Não possui"
        this.subCommands = options.subCommands 
        this.usage = options.usage
        this.category = options.category ?? "Utilitários"
        this.userPerms = options.userPerms ?? []
        this.botPerms = options.botPerms ?? []
        this.ownerOnly = options.ownerOnly ?? false
        this.ephemeral = options.ephemeral ?? false
        this.djOnly = options.djOnly ?? false
        this.marks = options.marks ?? {}
        this.showInHelp = options.showInHelp ?? true
    }

    run({ interaction }: RunCommand): Awaitable<any>  {
        return { interaction }
    }

    runAutoComplete({ interaction }: RunAutoComplete): Awaitable<any>  {
        return { interaction }
    }
}

export type RunCommand = {
    interaction: ChatInputCommandInteraction  
}

export type RunAutoComplete = {
    interaction: AutocompleteInteraction
}