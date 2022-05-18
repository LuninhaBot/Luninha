import Event from "../Structures/Event"
import EclipseClient from "../Structures/EclipseClient"
import { VoicePacket } from "erela.js"

export default class RawEvent extends Event {

    constructor(client: EclipseClient) {
        super(client, {
            name: "raw"
        })
    }

    run(d: VoicePacket) {
        this.client.music.updateVoiceState(d)
    }
}