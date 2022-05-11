import * as Config from "./Utils/Config"
import NFTCordClient from "./Structures/NFTCordClient"

const client = new NFTCordClient(Config)

client.start()