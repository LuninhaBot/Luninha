import { Structure } from "erela.js"

export default Structure.extend("Player", (Player) => {
    class LavalinkPlayer extends Player {
        skipVotes: unknown[]

        // @ts-ignore - TS doesn't know about this method
        constructor(...args) {
            // @ts-ignore - TS doesn't know about this method
            super(...args)
            this.skipVotes = []
        }
    }
    return LavalinkPlayer
}) 