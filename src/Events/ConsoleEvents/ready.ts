import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import Logger from "../../Utils/Logger"
import { WebhookClient } from "discord.js"
import { hooks } from "../../Utils/Config"
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig"

var Database = new JsonDB(new Config("./src/Database/db.json", true, true, "/"))

declare global {
    var db: JsonDB
}

global.db = Database

export default class ReadyEvent extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "ready",
        })
    }

    async run() {

        this.client.music.init(this.client.user?.id)

        this.client.user?.setPresence({
            activities: [{
                name: `Shard ${this.client.ws.shards.first()?.id} - ${this.client.ws.shards.last()?.id}`,
            }]
        })


        if (hooks.status.sendLogs) {
            new WebhookClient({
                url: hooks.status.cluster
            }).send({
                embeds: [{
                    title: `Cluster ${this.client.cluster.id} está online!`,
                    description: `Shards ${this.client.ws.shards.first()?.id} - ${this.client.ws.shards.last()?.id} estão operando!`,
                }]
            })
        }

        Logger.ready("Client is ready!")
    }
}