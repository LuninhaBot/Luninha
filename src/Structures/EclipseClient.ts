import { Client, Options, Collection } from "discord.js"
import { Shard } from "discord-cross-hosting"
import Cluster from "discord-hybrid-sharding"
import Utils from "./Utils"
import Command from "./Command"
import Event from "./Event"

export default class EclipseClient extends Client {

    owners: string[]
    prefix: string = "/"
    defaultPerms: any[] | undefined
    commands: Collection<string, Command>
    events: Collection<string, Event>
    utils: Utils
    cluster: Cluster.Client
    machine: Shard
    shardsInfoExtended: Collection<number, number>

    constructor(options = {} as { token: string, prefix: string, owners: string[], defaultPerms: any[] }) {
        super({
            intents: 5635,
            shardCount: Cluster.data.TOTAL_SHARDS,
            shards: Cluster.data.SHARD_LIST,
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

        this.cluster = new Cluster.Client(this)

        this.machine = new Shard(this.cluster)

        this.shardsInfoExtended = new Collection()

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