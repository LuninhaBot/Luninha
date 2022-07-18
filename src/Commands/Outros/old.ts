import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message } from "discord.js"
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class OldMembersCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "old",
            description: "Mostra os membros mais antigos no servidor e suas respectivas datas de entrada.",
            category: "Outros",
            subCommands: ["members"]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const emojis = {
            online: "<:onlinestatus:992489392130248764>",
            idle: "<:idlestatus:992489418973778040>",
            dnd: "<:dndstatus:992489511265255545>",
            offline: "<:offlinestatus:992489543565578280>",
            invisible: "<:offlinestatus:992489543565578280>"
        }

        let arr: { tag: string; timestamp: number, id: string, presence: string }[] = []
        const members = await interaction.guild!.members.fetch()
        members.forEach((u) => {
            arr.push({
                tag: u.user.tag,
                timestamp: u.joinedTimestamp ?? 0,
                id: u.id,
                presence: emojis[u.presence?.status ?? "offline"]
            })
        })

        let sort = arr.sort((a, b) => a?.timestamp - b?.timestamp)

        let i = 0
        const membersString = []
        for (const member of sort) {
            i++
            membersString.push(`**${i}º** ${member.presence} - ${member.tag == interaction.user.tag ? `**${member.tag}**` : member.tag} → <t:${~~(member.timestamp / 1000)}:R>`)
        }

        let pagesNum = Math.ceil(membersString.length / 10)

        const pages: EmbedBuilder[] = []
        for (let i = 0; i < pagesNum; i++) {
            const embed = new EmbedBuilder()
            embed.setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 })
            })

            embed.setColor("#04c4e4")
            embed.setDescription(membersString.slice(i * 10, i * 10 + 10).join("\n"))
            embed.setFooter({ text: `Pagina ${i + 1}/${pagesNum}` })
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

        const actionRow = new ActionRowBuilder<ButtonBuilder>()
        actionRow.addComponents([backwardButton, forwardButton])

        const msg = await interaction.followUp({
            embeds: [pages[0]],
            components: [actionRow]
        })

        const collector = interaction.channel!.createMessageComponentCollector({
            filter: (i) => {
                if (["forward", "backward"].includes(i.customId)) {
                    if (i.user.id !== interaction.user.id) {
                        i.reply(":x: | Apenas o autor pode usar os botões!")
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

                await i.deferUpdate()
                i.editReply({
                    embeds: [pages[page]]
                })
            }

            if (i.customId == "backward") {
                page = page > 0 ? --page : pages.length - 1

                await i.deferUpdate()
                i.editReply({
                    embeds: [pages[page]]
                })
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