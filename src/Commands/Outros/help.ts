import Command, { type runCommand } from "../../Structures/Command"
import type NFTCordClient from "../../Structures/NFTCordClient"
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, UnsafeButtonBuilder, Interaction, InteractionType } from "discord.js"

export default class HelpCommand extends Command {
    constructor(client: NFTCordClient) {
        super(client)
        this.name = "help"
        this.description = "Mostra todos os comandos disponíveis."
        this.category = "Outros"
        this.usage = "[comando]"
    }

    async run({ interaction }: runCommand) {
        if (!interaction.options.getString("comando")) {
            const embed0 = new EmbedBuilder()

            embed0.setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false ,size: 4096 })
            })
    
            embed0.setColor("#3a6e99")
            embed0.setDescription([
                `👋 | Eu tenho atualmente **${this.client.commands.size}** comandos.`,
                `:tools: | Você pode pedir suporte e ficar por dentro das novidades no meu [servidor oficial](https://linkfoda.com).`,
                `:question: | Você pode pedir ajuda para um comando específico, usando o comando \`${this.client.prefix}help [comando]\`.`,
                ``,
                `👑 | Fui desenvolvida por ${await (this.client.utils.fetchOwners(this.client.owners))}.`,
            ].join("\n"))
    
            const helpString = []
            let categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== "Desenvolvedor").map(cmd => cmd.category))
            for (let category of categories) {
                helpString.push(this.client.commands.filter(cmd => cmd.category === category).map(cmd => `<:seta:974012084926959676> | \`/${cmd.name}\` → ${cmd.description}`))
            }
    
            const pages: any[] = [embed0]
            for (let i = 0; i < helpString.length; i++) {
    
                let embed = new EmbedBuilder()
                embed.setColor("#3a6e99")
                embed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ forceStatic: false ,size: 4096 }) })
                embed.setDescription(helpString[i].join("\n"))
                embed.setTitle(`Categoria: ${categories[i]} [${this.client.commands.filter(cmd => cmd.category === categories[i]).size}]`)
                embed.setFooter({
                    text: `Página ${i + 1} de ${helpString.length}`,
                })
    
                pages.push(embed)
                pages[0].setFooter({ text: `Pagina 0 de ${helpString.length}` })
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
    
            const row = new ActionRowBuilder<UnsafeButtonBuilder>()
            row.addComponents([backwardButton, forwardButton,])
    
            await interaction.followUp({
                embeds: [embed0],
                components: [row]
            })
    
            let page = 0
            const collector = interaction.channel?.createMessageComponentCollector({
                filter: (interaction) => ["forward", "backward"].includes(interaction.customId),
                time: 60000
            })
    
            collector?.on("collect", async (i) => {
    
                if (i.customId == "forward") {
                    page = page + 1 < pages.length ? ++page : 0
                }
    
                if (i.customId == "backward") {
                    page = page > 0 ? --page : pages.length - 1
                }
    
                if (i.user.id !== interaction.user.id) {
                    i.reply({
                        content: ":x: | Você não pode mudar de página.",
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

            embed.setColor("#3a6e99")
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