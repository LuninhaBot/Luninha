import { PermissionResolvable } from "discord.js";

export const ClientConfig = {
    token: "",
    prefix: "/",
    owners: [],
    defaultPerms: [] as PermissionResolvable[],
}

export const ClusterManager = {
    authToken: "",
    host: "",
}

export const WebHooks = {
    guildCreate: {
        url: ""
    },
    guildDelete: {
        url: ""
    },
    status: {
        sendLogs: false,
        cluster: "",
        shards: "",
        errors: ""
    }
}

export const LavaLink = [
    {
        host: "localhost",
        password: "",
        port: 2333,
        identifier: "",
        retryDelay: 500,
    }
]

export const Spotify = {
    clientSecret: "",
    clientId: ""
}

export const GeniusToken = ""