import Event from "../Structures/Event"
import LuninhaClient from "../../Structures/LuninhaClient"
import { VoicePacket } from "erela.js"

export default class RawEvent extends Event {

    constructor(client: LuninhaClient) {
        super(client, {
            name: "raw"
        })
    }

    run(d: VoicePacket) {
        this.client.music.updateVoiceState(d)
    }
}