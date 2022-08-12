import Event from "../../Structures/Event"
import LuninhaClient from "../../Structures/LuninhaClient"
import Logger from "../../Utils/Logger"
import { WebHooks } from "../../Utils/Config"
import { WebhookClient } from "discord.js"

export default class ShardReady extends Event {

    constructor(client: LuninhaClient) {
        super(client, {
            name: "shardReady",
        })
    }

    async run(shard: number) {
        
        if (WebHooks.status.sendLogs) {
            new WebhookClient({
                url: WebHooks.status.shards
            }).send({
                username: this.client.user?.username,
                avatarURL: this.client.user!.displayAvatarURL(),
                embeds: [{
                    title: `Shard ${shard} => Cluster ${this.client.cluster.id} está online!`,
                }]
            })
        }

        Logger.ready(`Shard ${shard} => Cluster ${this.client.cluster.id} is ready!`)
    }
}