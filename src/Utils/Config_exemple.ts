import { PermissionResolvable } from "discord.js";

export const bot = {
    token: "",
    prefix: "/",
    owners: [],
    defaultPerms: [] as PermissionResolvable[],
}

export const clusterManager = {
    authToken: "",
    host: "",
}

export const hooks = {
    guildCreate: {
        url: ""
    },
    guildDelete: {
        url: ""
    },
    status: {
        sendLogs: false,
        cluster: "",
        shards: ""
    }
}

export const lavalink = [
    {
        host: "localhost",
        password: "",
        port: 2333,
        identifier: "",
        retryDelay: 500,
    }
]

export const geniusToken = ""