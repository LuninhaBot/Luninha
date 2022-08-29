import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"
import { EmbedBuilder, GuildMember } from "discord.js"

export default class UserInfoSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "user_info",
            category: "Utilitários",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

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
            Spammer: "<:ASpam:978185720214724628>",
            Quarantined: "😷"
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

        embed.setColor(m?.roles.highest.color ?? this.client.defaultColor)
        embed.setThumbnail(m?.displayAvatarURL({ forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")

        interaction.followUp({
            content: `${m?.user.bot ? "🤖" : "👤"} » Informações de **${m?.user.tag}**`,
            embeds: [embed]
        })

        return;
    }
}