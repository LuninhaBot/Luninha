import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import Logger from "../../Utils/Logger"
import { ActivityType } from "discord.js"

export default class ShardReady extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "shardReady",
        })
    }

    async run(shard: number) {

        this.client.user?.setPresence({
            activities: [{
                name: `Starting shard => ${shard}`,
                type: ActivityType.Watching,
            }]
        })

        this.client.shardsInfoExtended.set(shard, Date.now())
        
        Logger.ready(`Shard ${shard} => Cluster ${this.client.cluster.id} is ready!`)
    }
}