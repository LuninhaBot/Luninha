import { PermissionResolvable } from "discord.js";

export default {
    client: {
        token: "",
        prefix: "/",
        owners: [""],
        defaultPerms: [] as PermissionResolvable[],
    },
    clusterManager: {
        authToken: "",
        host: "",
    },
    hooks: {
        guildCreate: {
            url: ""
        },
        guildDelete: {
            url: ""
        },
        status: {
            cluster: "",
            shards: ""
        }
    },
    lavalink: [
        {
            host: "localhost", 
            password: "", 
            port: 2333, 
            identifier: "", 
            retryDelay: 500 ,
        }
    ]
}