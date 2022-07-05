import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, GuildMember, ButtonStyle } from "discord.js"
import fetch from "node-fetch"
import { bot } from "../../Utils/Config"

export default class UserCommands extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "user",
            description: "Mostra algumas coisas uteis sobre um usuário",
            category: "Outros",
            subCommands: ["info", "banner", "avatar"],
        })
    }

    async run({ interaction }: RunCommand) {

        if (interaction.options.getSubcommand(true) == "info") {

            await interaction.deferReply({ ephemeral: false, fetchReply: true })

            const m = await interaction.guild?.members.fetch((interaction.options.getMember("usuário") as GuildMember) ?? interaction.user.id)

            const arr: { tag: string; timestamp: number, id: string }[] = []
            const members = await interaction.guild!.members.fetch()
            members.forEach((u) => {
                arr.push({
                    tag: u.user.tag == m?.user.tag ? `**${u.user.tag}**` : u.user.tag,
                    timestamp: u.joinedTimestamp ?? 0,
                    id: u.id
                })
            })

            const sort = arr.sort((a, b) => a?.timestamp - b?.timestamp)
            const index = sort.findIndex(u => u.id == m?.user.id)


            const emojis = {
                Staff: "<:staff:978173420036575243>",
                Partner: "<:partner:978173517243764796>",
                Hypesquad: "<:hyperevent:978175869875003434>",
                BugHunterLevel1: "<:bughunter1:978175450801143818>",
                HypeSquadOnlineHouse1: "<:bravery:978176210762870795>",
                HypeSquadOnlineHouse2: "<:brilance:978176210934853632>",
                HypeSquadOnlineHouse3: "<:balance:978176210578333697>",
                PremiumEarlySupporter: "<:early:978176210922254406>",
                TeamPseudoUser: "<:bestfriends:978176903125028866>",
                BugHunterLevel2: "<:bughunter2:978175450377519134>",
                VerifiedBot: "<:verifedbot:978177522057502731>",
                VerifiedDeveloper: "<:dev:978175250967719956>",
                CertifiedModerator: "<:mod:978174836025196594>",
                BotHTTPInteractions: "<:slash:978177497701183508>",
                Spammer: "<:ASpam:978185720214724628>"
            }

            const avatar = m?.avatar ? m?.avatar : m?.user.avatar
            const nitro = avatar?.startsWith("a_") ? "<:nitro:979250617333710908>" : ""
            const flags = m?.user.flags?.toArray()

            const startingValue = (index - 5) <= 0 ? 0 : index - 5
            const endingValue = (index + 6) >= sort.length ? sort.length : index + 6

            const embed = new EmbedBuilder()
            embed.setDescription([
                `ID: **${m?.user.id}** ${nitro}${flags?.map(flag => emojis[flag]).join("") ?? ""}${interaction.guild?.ownerId == m?.user.id ? "👑" : ""}`,
                `Criado em: **${m?.user.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**`,
                `Entrou em: **${m?.joinedAt?.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**`,
                `Ordem de entrada: ${sort.slice(startingValue, endingValue).map(u => u.tag).join(" > ")}`
            ].join("\n"))

            embed.setColor(m?.roles.highest.color ?? "#04c4e4")
            embed.setThumbnail(m?.displayAvatarURL({ forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")

            interaction.followUp({
                content: `${m?.user.bot ? "🤖" : "👤"} | Informações de **${m?.user.tag}**`,
                embeds: [embed]
            })

            return;
        }

        if (interaction.options.getSubcommand(true) == "banner") {

            const options = interaction.options.getString("usuário", false)
            const id = options?.match(/\d+/g)?.join("") ?? interaction.user.id

            const m = await interaction.guild!.members.fetch(id)

            const fe = await fetch(`https://discord.com/api/v10/users/${id}`, {
                headers: {
                    "Authorization": `Bot ${bot.token}`,
                    "Content-Type": "application/json"
                }
            })

            const json = await fe.json() as {
                id: string,
                username: string
                avatar: string
                avatar_decoration: string
                discriminator: string
                public_flags: number
                banner: string
                banner_color: string
                accent_color: string
            }

            if (!json.banner) {

                await interaction.deferReply({ ephemeral: true, fetchReply: true })
                interaction.followUp({
                    content: `:x: | Esté usuário não possui um banner.`,
                })

                return;
            } 

            await interaction.deferReply({ ephemeral: false, fetchReply: true })
            
            let embed = new EmbedBuilder()
            embed.setColor("#04c4e4")
            embed.setDescription(`🖼️ | Banner de **${m?.user.tag}**`)
            embed.setImage(`https://cdn.discordapp.com/banners/${json.id}/${json.banner}.${json.banner.startsWith("a_") ? "gif" : "png"}?size=4096`)

            interaction.followUp({
                embeds: [embed]
            })

            return;
        }

        if (interaction.options.getSubcommand(true) == "avatar") {

            await interaction.deferReply({ ephemeral: false, fetchReply: true })

            const options = interaction.options.getString("usuário", false)
            const id = options?.match(/\d+/g)?.join("") ?? interaction.user.id

            const user = await this.client.users.fetch(id).catch(() => { })
            const member = await interaction.guild?.members.fetch(id).catch(() => { })

            const guildAvatarButton = new ButtonBuilder({
                label: "Avatar do servidor",
                customId: "guildAvatar",
                style: ButtonStyle.Primary
            })

            const row = new ActionRowBuilder<ButtonBuilder>()
            row.addComponents([guildAvatarButton])

            const embed = new EmbedBuilder()
            embed.setDescription(`🖼️ | Avatar de **${user?.tag}**`)
            embed.setImage(user?.displayAvatarURL({ size: 4096, forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")
            embed.setColor("#04c4e4")
            interaction.followUp({
                embeds: [embed],
                components: member?.avatar ? [row] : []
            })

            
            await interaction.channel!.awaitMessageComponent({
                filter: (i) => {
                    if (["guildAvatar"].includes(i.customId)) {
                        if (i.user.id !== interaction.user.id) {
                            i.reply(":x: | Apenas o autor pode usar este botão!")
                            return false
                        }
                        return true
                    }
                    return false
                },
                time: 60000
            })


            const newEmbed = new EmbedBuilder()
            newEmbed.setDescription(`🖼️ | Avatar de **${member?.user.tag}**`)
            newEmbed.setImage(member?.displayAvatarURL({ size: 4096, forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")
            newEmbed.setColor("#04c4e4")
            interaction.editReply({
                embeds: [newEmbed],
                components: []
            })

            return;
        }
    }
}