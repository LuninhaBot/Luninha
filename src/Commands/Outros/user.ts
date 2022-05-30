import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, GuildMember, Attachment, ButtonStyle, User } from "discord.js"

export default class UserCommands extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "user",
            description: "Mostra informações sobre um usuário",
            category: "Outros",
            usage: "info  | avatar ",
        })
    }

    async run({ interaction }: RunCommand) {

        if (interaction.options.getSubcommand(true) == "info") {

            let m = await interaction.guild?.members.fetch((interaction.options.getMember("usuário") as GuildMember) ?? interaction.user.id)
    
            //let arr: { tag: string; timestamp: number, id: string }[] = []
            //let members = await interaction.guild?.members.fetch()
            //members?.forEach((u) => {
                //arr.push({
                    //tag: u.user.tag == m?.user.tag ? `**${u.user.tag}**` : u.user.tag,
                    //timestamp: u.joinedTimestamp ?? 0,
                    //id: u.id
                //})
            //})

            //let sort = arr.sort((a, b) => a?.timestamp - b?.timestamp)
            //let index = sort.findIndex(u => u.id == m?.user.id)

            /*
             * Um dia eu consigo fazer a ordem de entrada mas esse dia não é hoje
            */

            let emojis = {
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

            let avatar = m?.avatar ? m?.avatar : m?.user.avatar
            let nitro = avatar?.startsWith("a_") ? "<:nitro:979250617333710908>" : ""
            let flags = m?.user.flags?.toArray()

            let embed = new EmbedBuilder()
            embed.setDescription([
                `ID: **${m?.user.id}** ${nitro}${flags?.map(flag => emojis[flag]).join("") ?? ""}${interaction.guild?.ownerId == m?.user.id ? "👑" : ""}`,
                `Criado em: **${m?.user.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**`,
                `Entrou em: **${m?.joinedAt?.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**`,
                //`Ordem de entrada: tem nada`
            ].join("\n"))

            embed.setColor(m?.roles.highest?.color || "#80088b")
            embed.setThumbnail(m?.displayAvatarURL({ forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")
            interaction.followUp({
                content: `${m?.user.bot ? "🤖" : "👤"} | Informaçoes de ${m?.user.tag}`,
                embeds: [embed]
            })

            return;
        }

        if (interaction.options.getSubcommand(true) == "avatar") {


            let options = interaction.options.getString("usuário", false)
            let id = options?.match(/\d+/g)?.join("") ?? interaction.user.id

            let user = await this.client.users.fetch(id).catch(() => { })
            let member = await interaction.guild?.members.fetch(id).catch(() => { })

            let guildAvatarButton = new ButtonBuilder({
                label: "Avatar do servidor",
                customId: "guildAvatar",
                style: ButtonStyle.Primary
            })

            let row = new ActionRowBuilder<ButtonBuilder>()
            row.addComponents([guildAvatarButton])

            let embed = new EmbedBuilder()
            embed.setDescription(`🖼️ | Avatar de **${user?.tag}**`)
            embed.setImage(user?.displayAvatarURL({ size: 4096, forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")
            embed.setColor("#80088b")
            interaction.followUp({
                embeds: [embed],
                components: member?.avatar ? [row] : []
            })

            const collector = interaction.channel?.createMessageComponentCollector({
                filter: (i) => ["guildAvatar"].includes(i.customId),
                time: 60000
            })

            collector?.on("collect", async (i) => {
                if (i.user.id !== interaction.user.id) {
                    i.reply({
                        content: ":x: | Apenas o autor do comando pode usar o botão",
                        ephemeral: true
                    })

                    return;
                }

        
                let newEmbed = new EmbedBuilder()
                newEmbed.setDescription(`🖼️ | Avatar de **${member?.user.tag}**`)
                newEmbed.setImage(member?.displayAvatarURL({ size: 4096, forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")
                newEmbed.setColor("#80088b")
                interaction.editReply({
                    embeds: [newEmbed],
                    components: []
                })
            })

            return;
        }
    }
}