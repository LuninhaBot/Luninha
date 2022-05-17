import Event from "../Structures/Event.js"
import EclipseClient from "../Structures/EclipseClient.js"
import { VoicePacket } from "erela.js"

export default class extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "raw",
        })
    }

    async run(d: VoicePacket) {
        this.client.music.updateVoiceState(d)
    }
}