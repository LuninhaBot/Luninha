import { EmbedBuilder, Message } from "discord.js"
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
                iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 })
            })

            let emojis = [
                { emoji: "🏘️", number: 0 },
                { emoji: "1️⃣", number: 1 },
                { emoji: "2️⃣", number: 2 },
                { emoji: "3️⃣", number: 3 },
                { emoji: "4️⃣", number: 4 },
                { emoji: "5️⃣", number: 5 },
                { emoji: "6️⃣", number: 6 },
                { emoji: "7️⃣", number: 7 },
                { emoji: "8️⃣", number: 8 },
                { emoji: "9️⃣", number: 9 },
                { emoji: "🔟", number: 10 }
            ]

            embed0.setColor("#04c4e4")

            embed0.setDescription([
                `👋 | Eu tenho atualmente **${this.client.commands.size}** comandos.`,
                `:tools: | Você pode pedir suporte e ficar por dentro das novidades no meu [servidor](https://discord.gg/Ce2EhRkYe6).`,
                `:question: | Você pode pedir ajuda para um comando específico, usando \`${this.client.prefix}help [comando]\`.`,
                `⚙️ | Clique nos emojis abaixo para ver os comandos de cada categoria.`,
                `<:github_logo:991215243139239966> | Você pode me ajudar a melhorar, fazendo uma contribuição no meu [repositório](https://github.com/eclipse-labs)`,
                ``,
                `👑 | Fui desenvolvido por ${await (this.client.utils.fetchOwners(this.client.owners, true))}.`,
            ].join("\n"))

            embed0.setTimestamp()

            const helpString = []
            let categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== "Desenvolvedor").map(cmd => cmd.category))
            for (let category of categories) {
                helpString.push(this.client.commands.filter(cmd => cmd.category === category).map(cmd => `<:seta:974012084926959676> | \`/${cmd.name} ${cmd.subCommands?.join(" | ") ?? ""}\` → ${cmd.description}\n↳ Modo de uso <:seta:974012084926959676> \`${cmd.usage ?? "Não possui modo de uso"}\``))
            }

            const pages = [embed0]
            for (let i = 0; i < helpString.length; i++) {

                let embed = new EmbedBuilder()
                embed.setColor("#04c4e4")
                embed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ forceStatic: false, size: 4096 }) })
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

            let msg = await interaction.followUp({
                embeds: [embed0],
            }) as Message

            for (let amount = 0; amount < pages.length; amount++) {
                msg.react(emojis[amount].emoji)
            }

            const collector = msg.createReactionCollector({
                filter: (reaction, user) => user.id === interaction.user.id,
                time: 60000
            })

            collector.on("collect", async (reaction, user) => {

                switch (reaction.emoji.name) {
                    case "🏘️":
                    case "1️⃣":
                    case "2️⃣":
                    case "3️⃣":
                    case "4️⃣":
                    case "5️⃣":
                    case "6️⃣":
                    case "7️⃣":
                    case "8️⃣":
                    case "9️⃣":
                    case "🔟":

                    await reaction.users.remove(user.id).catch(() => { })
                    let page = emojis.find(emoji => emoji.emoji === reaction.emoji.name)?.number ?? 0
                    msg.edit({
                        embeds: [pages[page]]
                    })
                }
            })

            collector.on("end", () => {

                msg.reactions.removeAll().catch(() => { })
                msg.edit({
                    embeds: [embed0]
                })

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

            embed.setColor("#04c4e4")
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