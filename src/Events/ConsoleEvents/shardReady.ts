import Event from "../../Structures/Event"
import NFTCordClient from "../../Structures/NFTCordClient"
import Logger from "../../Utils/Logger"

export default class ShardReady extends Event {

    constructor(client: NFTCordClient) {
        super(client, {
            name: "shardReady",
        })
    }

    async run(shard: number) {

        this.client.user?.setPresence({
            activities: [{
                name: `Under development | Cluster ${this.client.cluster.id} [${shard}]`,
            }],
            status: "idle",
            shardId: shard,
        })
        
        Logger.ready(`Shard ${shard} is ready!`)
    }
}