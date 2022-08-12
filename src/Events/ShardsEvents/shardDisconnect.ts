import Event from "../../Structures/Event"
import LuninhaClient from "../../Structures/LuninhaClient"
import Logger from "../../Utils/Logger"
import { WebHooks } from "../../Utils/Config"
import { CloseEvent, WebhookClient } from "discord.js"

export default class ShardDisconnect extends Event {

    constructor(client: LuninhaClient) {
        super(client, {
            name: "shardDisconnect",
        })
    }

    async run(close: CloseEvent, shard: number) {

        if (WebHooks.status.sendLogs) {
            new WebhookClient({
                url: WebHooks.status.shards
            }).send({
                embeds: [{
                    title: `Shard ${shard} => Cluster ${this.client.cluster.id} se desconectou com o código ${close.code}!`,
                }]
            })
        }

        Logger.error(`Shard ${shard} => Cluster ${this.client.cluster.id} has disconnected with code ${close.code}`)
    }
}