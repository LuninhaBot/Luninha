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
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates
            ],
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.Message,
                Partials.GuildMember
            ],
            shardCount: Cluster.Client.getInfo().TOTAL_SHARDS,
            shards: Cluster.Client.getInfo().SHARD_LIST,
            makeCache: Options.cacheWithLimits({
                GuildInviteManager: 0,
                GuildStickerManager: 0,
                GuildEmojiManager: 0,
                ThreadManager: 0,
                PresenceManager: 0,
                GuildScheduledEventManager: 0,
                BaseGuildEmojiManager: 0,
                ThreadMemberManager: 0,
                ApplicationCommandManager: 0
            }),
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