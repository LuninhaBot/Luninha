import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"
import { EmbedBuilder } from "discord.js"

export default class ConfigViewSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "config_view",
            category: "Admin",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {
        
        const embed = new EmbedBuilder()
        embed.setTitle("Configurações do servidor")
        embed.setDescription([
            `**DJ**: ${db.get(`${interaction.guild!.id}.dj`) ? `<@&${db.get(`${interaction.guild!.id}.dj`)}>` : "Nenhum cargo definido"}`,
            `**Autorole**: ${db.get(`${interaction.guild!.id}.autorole`)?.map((r: string) => `<@&${r}>`).join(", ") ?? "Nenhum cargo definido"}`,
            `**Canal de logs de moderação**: ${db.get(`${interaction.guild!.id}.modlogs`) ? `<#${db.get(`${interaction.guild!.id}.modlogs`)}>` : "Nenhum canal definido"}`,
        ].join("\n"))
        embed.setColor(this.client.defaultColor)

        interaction.followUp({
            embeds: [embed]
        })
    }
}