import { Client } from "discord-cross-hosting"
import Cluster from "discord-hybrid-sharding"
import config from "./Utils/Config"
import Logger from "./Utils/Logger"

const client = new Client({
    agent: "bot",
    host: config.host,
    port: 3000,
    authToken: config.authToken,
    rollingRestarts: false,
})

client.connect()

const manager = new Cluster.Manager(`${__dirname}/index.js`, {
    totalShards: "auto",
    totalClusters: "auto",
    token: config.token,
})

manager.on("clusterCreate", (cluster) => {
    Logger.log(`Started cluster ${cluster.id + 1}/${cluster.manager.clusterList.length}`)
})

client.listen(manager)
client.requestShardData().then(e => {

    if (!e) return
    if (!e.shardList) return
    manager.totalShards = e.totalShards
    manager.totalClusters = e.shardList.length
    manager.shardList = e.shardList
    manager.clusterList = e.clusterList
    manager.spawn({ timeout: -1 })

}).catch(e => console.log(e))