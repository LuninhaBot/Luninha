import Command from "../../Structures/Command"
import type NFTCordClient from "../../Structures/NFTCordClient"
import type { runCommand } from "../../Structures/Command"
import { table } from "table"

export default class PingCommand extends Command {
    constructor(client: NFTCordClient) {
        super(client)
        this.name = "ping"
        this.category = "Outros"
        this.description = "Mostra o ping do bot"
        this.usage = "[cluster | shards]"
        this.ownerOnly = false
    }

    async run({ interaction }: runCommand) {

        if (interaction.options.getString("opção", false) == "shards_value") {


            let pings = await this.client.machine.broadcastEval(`this.ws.shards.map(s => s.ping)`)
            let guilds = await this.client.machine.broadcastEval(`this.ws.shards.map((s) => this.guilds.cache.filter((g) => g.shardId === s.id).size)`)
            let users = await this.client.machine.broadcastEval(`this.ws.shards.map((s) => this.guilds.cache.filter((g) => g.shardId === s.id).reduce((a, b) => a + b.memberCount, 0))`)
            let stats = await this.client.machine.broadcastEval(`this.ws.shards.map((s) => s.status)`)
            let s = await this.client.machine.broadcastEval(`this.ws.shards.size`)

            let all = s.flat(Infinity).reduce((a: number, b: number) => a + b, 0)
            let allPings: [] = pings.flat(Infinity)
            let allGuilds: [] = guilds.flat(Infinity)
            let allUsers: [] = users.flat(Infinity)
            let allStats: [] = stats.flat(Infinity)


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
                ["ID", "Servidores", "Usuários", "Uptime", "Ping", "Status"]
            ]

            for (let i = 0; i < all; i++) {
                let uptime = this.client.shardsInfoExtended.get(i ?? 0)
                data.push([
                    `${interaction.guild?.shardId == i ? "»" : ""} ${i}`,
                    allGuilds[i] ?? 0,
                    allUsers[i] ?? 0,
                    this.client.utils.time(uptime ? Date.now() - uptime : 0),
                    allPings[i] + "ms",
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
                    content: "NFTCord Shards"
                }
            })


            this.client.utils.splitMessage(output, {
                maxLength: 2000,
                char: "\n"
            }).forEach(m => interaction.followUp("```prolog\n" + m + "```"))
    
            return;
        }

        if (interaction.options.getString("opção", false) == "cluster_value") {

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
            let clusterCont = await this.client.machine.broadcastEval(`this.cluster.count`)

            let allUptime = uptime.flat(Infinity)
            let allMemory = memory.flat(Infinity)
            let allGuilds = guilds.flat(Infinity)
            let allUsers = users.flat(Infinity)
            let allShards = shardsPerCluster.flat(Infinity)
            let allClusters = clusterCont.flat(Infinity).reduce((a: number, b: number) => a + b, 0)


            const data = [
                ["ID", "Servidores", "Usuários", "Shards", "Uptime", "Memória"]
            ]


            for (let i = 0; i < allClusters; i++) {
                data.push([
                    `${[...this.client.cluster.ids.keys()].includes(interaction.guild?.shardId || 0) && this.client.cluster.id == i ? "»" : ""} ${i} (${clustersName[i]})`,
                    allGuilds[i],
                    allUsers[i],
                    allShards[i],
                    this.client.utils.time(allUptime[i]),
                    this.client.utils.formatBytes(allMemory[i])
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
                    content: "NFTCord Clusters"
                }
            })

            this.client.utils.splitMessage(output, {
                maxLength: 2000,
                char: "\n"
            }).forEach(m => interaction.followUp("```prolog\n" + m + "```"))

            return;
        }


        await interaction.followUp({ content: "🏓" })

        await interaction.editReply({
            content: `**Pong!** Meu ping é de \`${this.client.ws.ping}ms\`. A latencia da API é \`${Date.now() - interaction.createdTimestamp}ms\`\n**Uptime:** ${this.client.utils.time(this.client?.uptime || 0)}`
        })
    }
}