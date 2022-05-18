import { Client } from "discord-cross-hosting"
import Cluster from "discord-hybrid-sharding"
import config from "./Utils/Config"
import Logger from "./Utils/Logger"

const client = new Client({
    agent: "bot",
    host: config.clusterManager.host,
    port: 3000,
    authToken: config.clusterManager.authToken,
    rollingRestarts: false,
})

client.connect()

const manager = new Cluster.Manager(`${__dirname}/index.js`, {
    totalShards: "auto",
    totalClusters: "auto",
    token: config.client.token
})

manager.on("clusterCreate", (cluster) => {
    Logger.log(`Started cluster ${cluster.id}`)
})

client.listen(manager)
client.requestShardData().then(async e => {

    if (!e) return
    if (!e.shardList) return
    manager.totalShards = e.totalShards
    manager.totalClusters = e.shardList.length
    manager.shardList = e.shardList
    manager.clusterList = e.clusterList
    manager.spawn()
}).catch(e => console.log(e))