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
            Staff: "<:new_staff:1047396681538351184>",
            ActiveDeveloper: "<:active_dev:1047394244878401596>",
            Partner: "<:new_partner:1047394391821647953>",
            Hypesquad: "<:Badge_HypeSquad_Events:1047395810087804950>",
            BugHunterLevel1: "<:badge_bug_hunter_lvl1:1047394853635498045>",
            HypeSquadOnlineHouse1: "<:bravery:1047395314656612403>",
            HypeSquadOnlineHouse2: "<:brilliance:1047395517895823400>",
            HypeSquadOnlineHouse3: "<:balance:1047395197253857391>",
            PremiumEarlySupporter: "<:earlysupporter:1047394925878202450>",
            TeamPseudoUser: "🫂",
            BugHunterLevel2: "<:Badge_Bug_Hunter_Lvl2:1047394887517089903>",
            VerifiedBot: "<:verified_bot:1047396347797573692>",
            VerifiedDeveloper: "<:Badge_EarlyVerified_BotDeveloper:1047394464769003541>",
            CertifiedModerator: "<:certified_mod:1047396490936602644>",
            BotHTTPInteractions: "<:slash:1047397383954235462>",
            Spammer: "<:ASpam:1047395596094410752>",
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