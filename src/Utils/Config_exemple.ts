import { PermissionResolvable } from "discord.js";

export const ClientConfig = {
    token: "",
    prefix: "/",
    owners: [],
    defaultPerms: [] as PermissionResolvable[],
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
        errors: ""
    }
}