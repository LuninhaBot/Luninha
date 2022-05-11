import Event from "../../Structures/Event"
import type NFTCordClient from "../../Structures/NFTCordClient"
import Logger from "../../Utils/Logger"

export default class ReadyEvent extends Event {

    constructor(client: NFTCordClient) {
        super(client, {
            name: "ready",
        })
    }

    async run() {
        this.client.user?.setPresence({
            activities: [{
                name: `Hello ;D`,
            }],
            status: "idle"
        })

        Logger.ready("Client is ready!")
    }
}