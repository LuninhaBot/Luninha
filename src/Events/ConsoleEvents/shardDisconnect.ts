import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import Logger from "../../Utils/Logger"

export default class ShardDisconnect extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "shardDisconnect",
        })
    }

    async run(shard: number) {

        this.client.shardsInfoExtended.set(shard, 0)
        
        Logger.warn(`Shard ${shard} => Cluster ${this.client.cluster.id} is disconnected!`)
    }
}