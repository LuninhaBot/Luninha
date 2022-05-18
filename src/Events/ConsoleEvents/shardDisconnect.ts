import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import Logger from "../../Utils/Logger"
import { CloseEvent } from "discord.js"

export default class ShardDisconnect extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "shardDisconnect",
        })
    }

    async run(close: CloseEvent, shard: number) {

        this.client.shardsInfoExtended.set(shard, { uptime: 0 })
        
        Logger.error(`Shard ${shard} => Cluster ${this.client.cluster.id} has disconnected with code ${close.code}`)
    }
}