import { Client, Options, PermissionResolvable, Collection } from "discord.js"
import Utils from "./Utils"
import type Command from "./Command"
import type Event from "./Event"

export default class NFTCordClient extends Client {

    owners: string[]
    prefix: string = "/"
    defaultPerms: any[] | undefined
    commands: Collection<string, Command>
    events: Collection<string, Event>
    utils: Utils

    constructor(options = {} as { token: string, prefix: string, owners: string[], defaultPerms: any[] }) {
        super({
            intents: 5635,
            shards: "auto",
            shardCount: 1,
            allowedMentions: {
                parse: [
                    "users",
                    "roles"
                ]
            },
            makeCache: Options.cacheWithLimits({
                MessageManager: 0,
                PresenceManager: 0,
                UserManager: 0,
                GuildBanManager: 0,
                StageInstanceManager: 0,
                ThreadMemberManager: 0
            })
        })

        this.validate(options)

        this.owners = options.owners

        this.commands = new Collection()

        this.events = new Collection()

        this.utils = new Utils(this)
    }

    validate(options = {} as { token: string, prefix: string, owners: string[], defaultPerms: any[] }) {
        if (typeof options !== "object") throw new TypeError("As opçoes so podem ser objetos")

		if (!options.token) throw new Error("Defina um token")
		this.token = options.token;

		if (!options.prefix) throw new Error("Defina um prefix")
		if (typeof options.prefix !== "string") throw new TypeError("Prefix apenas string")
		this.prefix = options.prefix

        if (!options.defaultPerms) throw new Error("Defina as permissoes")
    }

    async start() {
        this.utils.loadCommands()
        this.utils.loadEvents()
        await super.login(this.token as string)
    }
}