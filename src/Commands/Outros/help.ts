import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, Interaction } from "discord.js"
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class HelpCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "help",
            category: "Outros",
            description: "Mostra a lista de comandos",
            usage: "[comando]"
        })
    }

    async run({ interaction }: RunCommand) {
        if (!interaction.options.getString("comando")) {
            const embed0 = new EmbedBuilder()

            embed0.setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false ,size: 4096 })
            })
    
            embed0.setColor("#80088b")
            embed0.setDescription([
                `👋 | Eu tenho atualmente **${this.client.commands.size}** comandos.`,
                `:tools: | Você pode pedir suporte e ficar por dentro das novidades no meu [servidor oficial](https://discord.gg/Ce2EhRkYe6).`,
                `:question: | Você pode pedir ajuda para um comando específico, usando o comando \`${this.client.prefix}help [comando]\`.`,
                ``,
                `👑 | Fui desenvolvido por ${await (this.client.utils.fetchOwners(this.client.owners))}.`,
            ].join("\n"))
            embed0.setTimestamp()
    
            const helpString = []
            let categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== "Desenvolvedor").map(cmd => cmd.category))
            for (let category of categories) {
                helpString.push(this.client.commands.filter(cmd => cmd.category === category).map(cmd => `<:seta:974012084926959676> | \`/${cmd.name} ${cmd.usage}\` → ${cmd.description}`))
            }
    
            const pages = [embed0]
            for (let i = 0; i < helpString.length; i++) {
    
                let embed = new EmbedBuilder()
                embed.setColor("#80088b")
                embed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ forceStatic: false ,size: 4096 }) })
                embed.setDescription(helpString[i].join("\n"))
                embed.setTitle(`Categoria: ${categories[i]} [${this.client.commands.filter(cmd => cmd.category === categories[i]).size}]`)
                embed.setTimestamp()
                embed.setFooter({
                    text: `Página ${i + 1} - ${helpString.length}`
                })

                pages[0].setFooter({
                    text: `Página 0 - ${helpString.length}`
                })
                pages.push(embed)
            }
    
            const forwardButton = new ButtonBuilder({
                emoji: "➡️",
                customId: "forward1",
                style: ButtonStyle.Primary
            })
    
            const backwardButton = new ButtonBuilder({
                emoji: "⬅️",
                customId: "backward1",
                style: ButtonStyle.Primary
            })
    
            const row = new ActionRowBuilder<ButtonBuilder>()
            row.addComponents([backwardButton, forwardButton,])
    
            await interaction.followUp({
                embeds: [embed0],
                components: [row]
            })
    
            let page = 0
            const collector = interaction.channel!.createMessageComponentCollector({
                filter: (i) => ["forward1", "backward1"].includes(i.customId),
                componentType: ComponentType.Button,
                time: 60000
            })
    
            collector.on("collect", async (i) => {
    
                if (i.user.id !== interaction.user.id) {
                    await i.deferReply({ ephemeral: true })

                    i.editReply({
                        content: ":x: | Você não pode mudar de página.",
                    })
                    return;
                }
    
                if (i.customId == "forward1") {
                    page = page + 1 < pages.length ? ++page : 0

                    await i.deferUpdate()
    
                    i.editReply({
                        embeds: [pages[page]],
                        components: [row]
                    })
    
                    collector.resetTimer()
                    return;
                }
    
                if (i.customId == "backward1") {
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
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false ,size: 4096 })
            })

            embed.setColor("#80088b")
            embed.setDescription([
                `📚 | **Nome**: \`${command.name}\` → \`${command.description}\``,
                `📋 | **Uso**: \`${this.client.prefix}${command.name} ${command.usage}\``,
                `📝 | Categoria: **${command.category}**`
            ].join("\n"))
            
            embed.setFooter({
                text: `Isso [] é opcional e <> é obrigatório.`
            })

            interaction.followUp({
                embeds: [embed]
            })
        }
    }
}