import Command, { RunCommand } from "../../Structures/Command.js"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, User, Embed, ButtonStyle, ComponentType } from "discord.js"
import EclipseClient from "../../Structures/EclipseClient.js"

export default class QueueCommand extends Command {
    constructor(client: EclipseClient) {
        super(client)
        this.name = "queue"
        this.description = "Mostra a fila de música"
        this.category = "Música"
    }

    async run({ interaction }: RunCommand) {
        const player = this.client.music.players.get(interaction.guild!.id ?? "")

        if (!player) return interaction.followUp(":x: | Não tem nada tocando no servidor!")

        const parsedQueueDuration = this.client.utils.formatDuration(this.client.utils.getQueueDuration(player))
        let pagesNum = Math.ceil(player.queue.length / 10)

        const songStrings = []
        for (let i = 0; i < player.queue.length; i++) {
            const song = player.queue[i]
            // @ts-ignore
            songStrings.push(`**${i + 1}º** \`[${this.client.utils.formatDuration(song.duration ?? 0)}]\` **${song.title}** - <@${song.requester ? song.requester.id : null}>`)
        }

        const pages: EmbedBuilder[] = []
        for (let i = 0; i < pagesNum; i++) {

            const str = songStrings.slice(i * 10, i * 10 + 10).join("\n")
            const embed = new EmbedBuilder()
            embed.setColor("#80088b")
            embed.setDescription(str == "" ? "Nada na fila de música" : str)
            embed.setFooter({
                text: `Página ${i + 1}/${pagesNum}`,
            })

            pages.push(embed)
        }

        const forwardButton = new ButtonBuilder({
            emoji: "➡️",
            customId: "forward",
            style: ButtonStyle.Primary
        })

        const backwardButton = new ButtonBuilder({
            emoji: "⬅️",
            customId: "backward",
            style: ButtonStyle.Primary
        })

        let row = new ActionRowBuilder<ButtonBuilder>()
        row.addComponents([backwardButton, forwardButton])

        await interaction.followUp({
            content: `**[${player.queue.current!.title}](${player.queue.current!.uri})** | ${player.queue.length} músicas ${parsedQueueDuration}`,
            embeds: [pages[0]],
            components: [row]
        })

        const collector = interaction.channel!.createMessageComponentCollector({
            filter: (i) => ["forward", "backward"].includes(i.customId),
            componentType: ComponentType.Button,
            time: 60000
        })

        var page = 0
        collector.on("collect", async (i) => {
            if (!i.isButton()) return;

            if (i.customId == "forward") {
                page = page + 1 < pages.length ? ++page : 0
            }

            if (i.customId == "backward") {
                page = page > 0 ? --page : pages.length - 1
            }

            if (i.user.id !== "interaction.user.id") {
                interaction.followUp({
                    content: ":x: | Apenas o autor pode usar os botões!",
                    ephemeral: true
                })
                return;
            }

            if (i.customId == "forward") {
                await i.deferUpdate()

                i.editReply({
                    embeds: [pages[page]],
                    components: [row]
                })

                collector.resetTimer()
                return;
            }

            if (i.customId == "backward") {
                await i.deferUpdate()
                
                i.editReply({
                    embeds: [pages[page]],
                    components: [row]
                })

                collector.resetTimer()
                return;
            }
        })
    }
}