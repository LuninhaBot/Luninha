export default {
    client: {
        token: "",
        prefix: "/",
        owners: [""],
        defaultPerms: [],
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