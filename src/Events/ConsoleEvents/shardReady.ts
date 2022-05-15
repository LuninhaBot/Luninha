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
            shardId: shard,
        })

        this.client.shardsInfoExtended.set(shard, Date.now())
        
        Logger.ready(`Shard ${shard} => Cluster ${this.client.cluster.id} is ready!`)
    }
}