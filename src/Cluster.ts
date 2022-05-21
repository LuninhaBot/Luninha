import { Client } from "discord-cross-hosting"
import Cluster from "discord-hybrid-sharding"
import { WebhookClient } from "discord.js"
import { clusterManager, hooks, bot } from "./Utils/Config"
import Logger from "./Utils/Logger"

const client = new Client({
    agent: "bot",
    host: clusterManager.host,
    port: 3000,
    authToken: clusterManager.authToken,
    rollingRestarts: false,
})

client.connect()

const manager = new Cluster.Manager(`${__dirname}/index.js`, {
    totalShards: "auto",
    totalClusters: "auto",
    token: bot.token
})

manager.on("clusterCreate", (cluster) => {
    Logger.log(`Started cluster ${cluster.id}`)

    cluster.on("death", async (machine) => {
        let shards = cluster.manager.shardList
        if (hooks.status.sendLogs) {
            new WebhookClient({
                url: hooks.status.cluster
            }).send({
                embeds: [{
                    title: `Cluster ${cluster.id} morreu com o código ${machine.exitCode}. Reiniciando...`,
                    // @ts-ignore
                    description: `Shards ${shards[cluster.id][0]} - ${shards[cluster.id].pop()}  serão reiniciadas!`,
                }]
            })
        }
    })
})

client.listen(manager)
client.requestShardData().then(e => {

    if (!e) return;
    if (!e.shardList) return;
    manager.totalShards = e.totalShards
    manager.totalClusters = e.shardList.length
    manager.shardList = e.shardList
    manager.clusterList = e.clusterList
    manager.spawn()
}).catch(e => console.log(e))