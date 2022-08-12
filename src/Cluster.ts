import { Client } from "discord-cross-hosting"
import Cluster from "discord-hybrid-sharding"
import { WebhookClient } from "discord.js"
import { ClusterManager, WebHooks, ClientConfig } from "./Utils/Config"
import Logger from "./Utils/Logger"

const client = new Client({
    agent: "bot",
    host: ClusterManager.host,
    port: 3000,
    authToken: ClusterManager.authToken,
    rollingRestarts: false
})

client.connect()

const manager = new Cluster.Manager(`${__dirname}/index.js`, {
    totalShards: "auto",
    totalClusters: "auto",
    token: ClientConfig.token,
    restarts: {
        max: 5,
        interval: 60000 * 60
    }
})

manager.on("clusterCreate", (cluster) => {
    Logger.warn(`Started cluster ${cluster.id}`)

    cluster.on("death", async (machine) => {
        const shards = cluster.manager.shardList
        if (WebHooks.status.sendLogs) {
            new WebhookClient({
                url: WebHooks.status.cluster
            }).send({
                embeds: [{
                    title: `Cluster ${cluster.id} morreu com o código ${machine.exitCode}. Reiniciando...`,
                    // @ts-ignore
                    description: `Shards ${shards[cluster.id][0] ?? 0} - ${shards[cluster.id].pop() ?? 0}  serão reiniciadas!`,
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