import { Shard } from "discord-cross-hosting"
import Cluster from "discord-hybrid-sharding"
import { Client, Collection, GatewayIntentBits, Partials, Options, PermissionResolvable } from "discord.js"
import EclipseLavalink from "../LavalinkManager"
import Command from "./Command"
import Event from "./Event"
import Utils from "./Utils"

export default class EclipseClient extends Client {

    owners: string[]
    prefix: string = "/"
    defaultPerms!: PermissionResolvable[]
    commands: Collection<string, Command>
    events: Collection<string, Event>
    utils: Utils
    cluster: Cluster.Client
    machine: Shard
    music: EclipseLavalink

    constructor(options = {} as { token: string, prefix: string, owners: string[], defaultPerms: PermissionResolvable[] }) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessageReactions
            ],
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.Message,
                Partials.Reaction,
                Partials.GuildMember
            ],
            
            // @ts-ignore | For Typescript use Cluster.Client.getInfo() instead of Cluster.data
            shardCount: Cluster.data.TOTAL_SHARDS,
            // @ts-ignore | For Typescript use Cluster.Client.getInfo() instead of Cluster.data
            shards: Cluster.data.SHARD_LIST,

            allowedMentions: {
                parse: [
                    "users",
                    "roles"
                ]
            },
            ws: {
                properties: {
                    browser: "Discord Android"
                }
            }
        })

        this.validate(options)

        this.owners = options.owners

        this.commands = new Collection()

        this.events = new Collection()

        this.cluster = new Cluster.Client(this)

        this.machine = new Shard(this.cluster)

        this.music = new EclipseLavalink(this)

        this.utils = new Utils(this)
    }

    validate(options = {} as { token: string, prefix: string, owners: string[], defaultPerms: PermissionResolvable[] }) {
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