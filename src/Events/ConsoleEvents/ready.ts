import Event from "../../Structures/Event"
import type EclipseClient from "../../Structures/EclipseClient"
import Logger from "../../Utils/Logger"

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
                name: `Ready for attack!`,
            }]
        })

        Logger.ready("Client is ready!")
    }
}