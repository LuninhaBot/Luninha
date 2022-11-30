import { ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, ActionRowBuilder } from "discord.js"
import Command, { RunAutoComplete, RunCommand } from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"

export default class HelpCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "help",
            category: "Utilitários",
            description: "Mostra a lista de comandos.",
            usage: "[comando]"
        })
    }

    async run({ interaction }: RunCommand) {
        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        if (!interaction.options.getString("comando")) {
            const embed0 = new EmbedBuilder()

            embed0.setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 })
            })

            embed0.setColor(this.client.defaultColor)

            embed0.setDescription([
                `👋 | Eu tenho atualmente **${this.client.commands.size}** comandos.`,
                `:tools: | Você pode pedir suporte e ficar por dentro das novidades no meu [servidor](https://discord.gg/Ce2EhRkYe6).`,
                `:question: | Você pode pedir ajuda para um comando específico, usando \`${this.client.prefix}help [comando]\`.`,
                `⚙️ | Clique nos emojis abaixo para ver os comandos de cada categoria.`,
                `<:github_logo:1047399812347211796> | Você pode me ajudar a melhorar, fazendo uma contribuição no meu [repositório](https://github.com/eclipse-labs)`,
                ``,
                `👑 | Fui desenvolvida por ${await (this.client.utils.fetchOwners(this.client.owners, true))}.`,
            ].join("\n"))

            embed0.setTimestamp()

            const helpString = []
            const categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== "Desenvolvedor").map(cmd => cmd.category))
            for (const category of categories) {
                helpString.push(this.client.commands.filter(cmd => cmd.category === category && cmd.showInHelp === true).map(cmd => `\`/${cmd.name} ${cmd.subCommands?.join(" | ") ?? ""}\` → ${cmd.description}${cmd.usage ? `\n⤷ Modo de uso → \`${cmd.usage}\`` : ""}`))
            }

            const pages = [embed0]
            for (let i = 0; i < helpString.length; i++) {

                const embed = new EmbedBuilder()
                embed.setColor(this.client.defaultColor)
                embed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 }) })
                embed.setDescription(helpString[i].join("\n"))
                embed.setTitle(`Categoria: ${categories[i]}`)
                embed.setTimestamp()
                embed.setFooter({
                    text: `Página ${i + 1}/${helpString.length}`
                })

                pages[0].setFooter({
                    text: `Página 0/${helpString.length}`
                })

                pages.push(embed)
            }

            const forwardButton = new ButtonBuilder({
                label: "Proxima página",
                customId: `backward__${interaction.user.id}`,
                style: ButtonStyle.Primary
            })

            const backwardButton = new ButtonBuilder({
                label: "Página anterior",
                customId: `forward_${interaction.user.id}`,
                style: ButtonStyle.Primary
            })

            const row = new ActionRowBuilder<ButtonBuilder>()
            row.addComponents([backwardButton, forwardButton,])

            const msg = await interaction.followUp({
                embeds: [embed0],
                components: [row]
            })

            const collector = interaction.channel!.createMessageComponentCollector({
                filter: (i) => {
                    if ([`forward_${interaction.user.id}`, `backward__${interaction.user.id}`].includes(i.customId)) {
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

                if (i.customId == `forward_${interaction.user.id}`) {
                    page = page + 1 < pages.length ? ++page : 0

                    await i.deferUpdate()

                    i.editReply({
                        embeds: [pages[page]],
                        components: [row]
                    })

                    collector.resetTimer()
                    return;
                }

                if (i.customId == `backward__${interaction.user.id}`) {
                    page = page > 0 ? --page : pages.length - 1

                    await i.deferUpdate()

                    i.editReply({
                        embeds: [pages[page]],
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
        } else {
            let command = this.client.commands.get(interaction.options.getString("comando", true))
            if (!command) {
                interaction.followUp({
                    content: ":x: | Não encontrei este comando.",
                })
                return;
            }

            const embed = new EmbedBuilder()
            embed.setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 })
            })

            embed.setColor(this.client.defaultColor)
            embed.setDescription([
                `📚 | **Nome**: \`${command.name}\` → \`${command.description}\``,
                `📋 | **Uso**: \`${this.client.prefix}${command.name} ${command.usage}\``,
                `📝 | **Categoria**: \`${command.category}\``,
                `${command.subCommands ? `📖 | **Sub comandos**: \`${command.subCommands.join(" | ")}\`` : ""}`
            ].join("\n"))

            embed.setFooter({
                text: `Isso [] é opcional e <> é obrigatório.`
            })

            interaction.followUp({
                embeds: [embed]
            })
        }
    }

    async runAutoComplete({ interaction }: RunAutoComplete) {
        
        const commandsList = this.client.commands.filter(cmd => cmd.showInHelp === true && cmd.category !== "Desenvolvedor")

        if (!commandsList || commandsList.size == 0) {
            interaction.respond([{ value: "undefined", name: `Não foi localizado nenhum comando` }]);
            return;
        }

        interaction.respond(commandsList.map(cmd => ({ value: cmd.name, name: cmd.name })));

    }
}