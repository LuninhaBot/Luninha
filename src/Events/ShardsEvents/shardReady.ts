import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import Logger from "../../Utils/Logger"
import config from "../../Utils/Config"
import { WebhookClient } from "discord.js"

export default class ShardReady extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "shardReady",
        })
    }

    async run(shard: number) {

        this.client.shardsInfoExtended.set(shard, { uptime: Date.now() })
        
        new WebhookClient({
            url: config.hooks.status.shards
        }).send({
            embeds: [{
                title: `Shard ${shard} => Cluster ${this.client.cluster.id} está online!`,
            }]
        })

        Logger.ready(`Shard ${shard} => Cluster ${this.client.cluster.id} is ready!`)
    }
}