import Event from "../../Structures/Event"
import NFTCordClient from "../../Structures/NFTCordClient"
import Logger from "../../Utils/Logger"

export default class ShardDisconnect extends Event {

    constructor(client: NFTCordClient) {
        super(client, {
            name: "shardDisconnect",
        })
    }

    async run(shard: number) {

        this.client.shardsInfoExtended.set(shard, 0)
        
        Logger.warn(`Shard ${shard} => Cluster ${this.client.cluster.id} is disconnected!`)
    }
}