import config from "./Utils/Config"
import NFTCordClient from "./Structures/NFTCordClient"

const client = new NFTCordClient(config)

client.start()