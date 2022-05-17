import config from "./Utils/Config"
import EclipseClient from "./Structures/EclipseClient"

const client = new EclipseClient(config.client)

client.start()