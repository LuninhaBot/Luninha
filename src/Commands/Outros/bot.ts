import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { table } from "table"

export default class InviteCommand extends Command {
    constructor(client: EclipseClient) {
        super(client)
        this.name = "bot"
        this.usage = "convite | shards | cluster"
        this.description = "...?"
        this.category = "Outros"
    }

    async run({ interaction }: RunCommand) {

        let subCommand = interaction.options.getSubcommand(false)

        if (subCommand == "convite") {
            interaction.followUp({
                content: "Que bom que gostou das minhas funcionalidades -> [Convite aqui](https://discord.com/api/oauth2/authorize?client_id=683040461434388501&permissions=8&scope=bot%20applications.commands)",
                ephemeral: true
            })

            return;
        }

        if (subCommand == "shards") {

            let pings = await this.client.machine.broadcastEval(`this.ws.shards.map(s => s.ping)`)
            let guilds = await this.client.machine.broadcastEval(`this.ws.shards.map((s) => this.guilds.cache.filter((g) => g.shardId === s.id).size)`)
            let users = await this.client.machine.broadcastEval(`this.ws.shards.map((s) => this.guilds.cache.filter((g) => g.shardId === s.id).reduce((a, b) => a + b.memberCount, 0))`)
            let stats = await this.client.machine.broadcastEval(`this.ws.shards.map((s) => s.status)`)
            let uptime = await this.client.machine.broadcastEval(`this.shardsInfoExtended.map((s) => s.uptime)`)
            let s = await this.client.machine.broadcastEval(`this.ws.shards.size`)

            let all = s.flat(Infinity).reduce((a: number, b: number) => a + b, 0)
            let allPings: [] = pings.flat(Infinity)
            let allGuilds: [] = guilds.flat(Infinity)
            let allUsers: [] = users.flat(Infinity)
            let allStats: [] = stats.flat(Infinity)
            let allUptimes: [] = uptime.flat(Infinity)


            const status = {
                0: "OK",
                1: "CONECTANDO",
                2: "RECONECTANDO",
                3: "OCIOSO",
                4: "INICIALIZANDO",
                5: "DESCONECTADO",
                6: "ESPERANDO SERVIDORES",
                7: "IDENTIFICANDO",
                8: "RETOMANDO"
            }

            const data = [
                ["ID", "Servidores", "Usuários", "Uptime", "Ping", "Players", "Status"]
            ]


            for (let i = 0; i < all; i++) {
                let players = this.client.guilds.cache.map((g) => g.shardId == i ? this.client.music.players.filter(p => p.options.guild == g.id).size : 0).reduce((a, b) => a + b, 0) ?? 0
                data.push([
                    `${interaction.guild?.shardId == i ? "»" : ""} ${i}`,
                    allGuilds[i] ?? 0,
                    allUsers[i] ?? 0,
                    this.client.utils.time(allUptimes[i] ? Date.now() - allUptimes[i] : 0),
                    allPings[i] + "ms",
                    String(players),
                    status[allStats[i]]
                ])
            }

            const output = table(data, {
                border: {
                    topBody: `─`,
                    topJoin: `┬`,
                    topLeft: `┌`,
                    topRight: `┐`,
                    bottomBody: `─`,
                    bottomJoin: `┴`,
                    bottomLeft: `└`,
                    bottomRight: `┘`,
                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,
                    joinBody: `─`,
                    joinLeft: `├`,
                    joinRight: `┤`,
                    joinJoin: `┼`
                },
                columnDefault: {
                    alignment: "center"
                },
                header: {
                    alignment: "center",
                    content: "Eclipse Shards"
                }
            })


            this.client.utils.splitMessage(output, {
                maxLength: 1800,
                char: "\n"
            }).forEach(m => interaction.followUp("```apache\n" + m + "```"))
    
            return;
        }

        if (subCommand == "cluster") {

            const clustersName = [
                "Denky",
                "Himari",
                "Ayume",
                "Nisruksha",
                "Juh",
                "Eclipse",
                "Star",
                "Zuly",
                "Neeph",
                "Kanade",
                "Sagiri"
            ]

            let memory = await this.client.machine.broadcastEval(`process.memoryUsage().rss`)
            let uptime = await this.client.machine.broadcastEval(`this.uptime`)
            let guilds = await this.client.machine.broadcastEval(`this.guilds.cache.size`)
            let users = await this.client.machine.broadcastEval(`this.guilds.cache.map(g => g.memberCount).reduce((a, g) => a + g, 0)`)
            let shardsPerCluster = await this.client.machine.broadcastEval(`[...this.cluster.ids.keys()].length`)
            let clusterCount = await this.client.machine.broadcastEval(`this.cluster.count`)
            let playersCount = await this.client.machine.broadcastEval(`this.music.players.size`)
            let clusterController = await this.client.machine.request({ requestStatus: true })

            let allUptime = uptime.flat(Infinity)
            let allMemory = memory.flat(Infinity)
            let allGuilds = guilds.flat(Infinity)
            let allUsers = users.flat(Infinity)
            let allShards = shardsPerCluster.flat(Infinity)
            let allClusters = clusterCount.flat(Infinity)
            let allPlayers = playersCount.flat(Infinity)


            const data = [
                ["ID", "Servidores", "Usuários", "Shards", "Players","Uptime", "Memória"]
            ]


            for (let i = 0; i < allClusters.length; i++) {
                data.push([
                    `${[...this.client.cluster.ids.keys()].includes(interaction.guild?.shardId ?? 0) && this.client.cluster.id == i ? "»" : ""} ${i} (${clustersName[i]})`,
                    allGuilds[i] ?? 0,
                    allUsers[i] ?? 0,
                    allShards[i] ?? 0,
                    allPlayers[i],
                    this.client.utils.time(allUptime[i] ?? 0),
                    this.client.utils.formatBytes(allMemory[i] ?? 0)
                ])
            }

            data.push([
                "Controlador (Ayana)",
                "*",
                "*",
                "*",
                "*",
                this.client.utils.time(clusterController.uptime),
                this.client.utils.formatBytes(clusterController.memory)
            ])


            const output = table(data, {
                border: {
                    topBody: `─`,
                    topJoin: `┬`,
                    topLeft: `┌`,
                    topRight: `┐`,
                    bottomBody: `─`,
                    bottomJoin: `┴`,
                    bottomLeft: `└`,
                    bottomRight: `┘`,
                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,
                    joinBody: `─`,
                    joinLeft: `├`,
                    joinRight: `┤`,
                    joinJoin: `┼`
                },
                columnDefault: {
                    alignment: "center"
                },
                header: {
                    alignment: "center",
                    content: "Eclipse Clusters"
                }
            })

            this.client.utils.splitMessage(output, {
                maxLength: 1800
            }).forEach(m => interaction.followUp("```apache\n" + m + "```"))
        }
    }
}