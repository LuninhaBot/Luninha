import Command, { RunCommand } from "../../../Structures/Command"
import EclipseClient from "../../../Structures/EclipseClient"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js"

export default class BanListSubCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "ban_list",
            description: "Lista os usuários banidos do servidor.",
            category: "Moderação",
            showInHelp: false,
        })
    }

    async run({ interaction }: RunCommand) {

        const banList = await interaction.guild!.bans.fetch().catch(() => { })

        if (!banList || banList.size == 0) {
            interaction.followUp(`:x: | Não foi localizado nenhum banimento`)

            return;
        }

        let pagesNum = Math.ceil(banList.size / 10)
        const banString = []

        for (let i = 0; i < banList.size; i++) {
            const ban = banList.map((user) => user)[i]
            banString.push(`**${i + 1}º** ${ban.user.tag} \`(${ban.user.id})\`\n⤷ Motivo: **${ban.reason ?? "Nenhum motivo informado"}**`)
        }

        const pages: EmbedBuilder[] = []
        for (let i = 0; i < pagesNum; i++) {
            const embed = new EmbedBuilder()
            embed.setColor("#04c4e4")
            embed.setTitle(`Lista de banimentos`)
            embed.setDescription(banString.slice(i * 10, (i + 1) * 10).join("\n"))
            embed.setFooter({
                text: `Página ${i + 1}/${pagesNum}`,
            })

            pages.push(embed)
        }

        const forwardButton = new ButtonBuilder({
            emoji: "➡️",
            customId: "forward",
            style: ButtonStyle.Secondary
        })

        const backwardButton = new ButtonBuilder({
            emoji: "⬅️",
            customId: "backward",
            style: ButtonStyle.Secondary
        })

        const row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents([backwardButton, forwardButton])

        const msg = await interaction.followUp({
            embeds: [pagesNum == 0 ? new EmbedBuilder().setDescription("Não há nenhum banimento!").setColor("#04c4e4") : pages[0]],
            components: [row]
        })

        const collector = interaction.channel!.createMessageComponentCollector({
            filter: (i) => {
                if (["forward", "backward"].includes(i.customId)) {
                    if (i.user.id !== interaction.user.id) {
                        i.reply({
                            content: ":x: | Apenas o autor pode usar os botões!",
                            ephemeral: true
                        })
                        return false
                    }
                    return true
                }
                return false
            },
            componentType: ComponentType.Button,
            time: 60000
        })

        var page = 0
        collector.on("collect", async (i) => {

            if (i.customId == "forward") {
                page = page + 1 < pages.length ? ++page : 0

                await i.deferUpdate().catch(() => { })

                i.editReply({
                    embeds: [
                        pagesNum == 0 ? new EmbedBuilder().setDescription("Não há nenhum banimento!").setColor("#04c4e4") : pages[page]
                    ],
                    components: [row]
                })

                collector.resetTimer()
                return;
            }

            if (i.customId == "backward") {
                page = page > 0 ? --page : pages.length - 1

                await i.deferUpdate().catch(() => { })

                i.editReply({
                    embeds: [
                        pagesNum == 0 ? new EmbedBuilder().setDescription("Não há nenhum banimento!").setColor("#04c4e4") : pages[page]
                    ],
                    components: [row]
                })

                collector.resetTimer()
                return;
            }
        })

        collector.on("end", () => {
            msg.edit({
                components: []
            }).catch(() => { })

            return;
        })
    }
}