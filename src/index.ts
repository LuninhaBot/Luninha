import { bot } from "./Utils/Config"
import EclipseClient from "./Structures/EclipseClient"

const client = new EclipseClient(bot)

client.start()