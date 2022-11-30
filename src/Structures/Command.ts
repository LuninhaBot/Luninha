import { PermissionResolvable, ChatInputCommandInteraction, Awaitable, AutocompleteInteraction } from "discord.js"
import LuninhaClient from "./LuninhaClient"


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
    showInHelp?: boolean
}

export default class Command {
    client: LuninhaClient
    name: string
    description?: string
    subCommands?: unknown[]
    usage?: string
    category: string
    userPerms: PermissionResolvable[]
    botPerms: PermissionResolvable[]
    ownerOnly: boolean
    ephemeral: boolean
    showInHelp?: boolean

    constructor(client: LuninhaClient, options: CommandOptions) {

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