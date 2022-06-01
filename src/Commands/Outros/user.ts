import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, GuildMember, ButtonStyle } from "discord.js"
import fetch from "node-fetch"
import { bot } from "../../Utils/Config"

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

            let arr: { tag: string; timestamp: number, id: string }[] = []
            let members = await interaction.guild?.members.fetch()
            members?.forEach((u) => {
                arr.push({
                    tag: u.user.tag == m?.user.tag ? `**${u.user.tag}**` : u.user.tag,
                    timestamp: u.joinedTimestamp ?? 0,
                    id: u.id
                })
            })

            let sort = arr.sort((a, b) => a?.timestamp - b?.timestamp)
            let index = sort.findIndex(u => u.id == m?.user.id)


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

            let avatar = m?.avatar ? m?.avatar : m?.user.avatar
            let nitro = avatar?.startsWith("a_") ? "<:nitro:979250617333710908>" : ""
            let flags = m?.user.flags?.toArray()

            const startingValue = (index - 7) <= 0 ? 0 : index - 6
            const endingValue = (index + 6) >= sort.length ? sort.length : index + 6

            if (m?.user.bot) {
                let infos = await fetch(`https://discord.com/api/v10/applications/${m?.user.id}/rpc`)
                let json = await infos.json() as {
                    id: string,
                    name: string,
                    icon: string,
                    description?: string,
                    rpc_origins?: string[],
                    owner?: {
                        avatar: string,
                        discriminator: string,
                        flags: number,
                        id: string,
                        username: string
                    }
                    type: number,
                    cover_image: string,
                    primary_sku_id: string,
                    hook: boolean,
                    slug?: string,
                    guild_id?: string,
                    bot_public: boolean,
                    bot_require_code_grant: boolean,
                    terms_of_service_url?: string,
                    privacy_policy_url?: string,
                    install_params: { scopes: string[], permissions: string },
                    verify_key: string,
                    flags: number,
                    tags: string[]
                }
    
                let intents = {
                    GATEWAY_PRESENCE: 1 << 12,
                    GATEWAY_PRESENCE_LIMITED: 1 << 13,
                    GATEWAY_GUILD_MEMBERS: 1 << 14,
                    GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
                    VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
                    //EMBEDDED: 1 << 17,
                    GATEWAY_MESSAGE_CONTENT: 1 << 18,
                    GATEWAY_MESSAGE_CONTENT_LIMITED: 1 << 19,
                }
    
                let translatedIntents = {
                    GATEWAY_PRESENCE: "Intent de presença",
                    GATEWAY_PRESENCE_LIMITED: "Intent de presença limitada",
                    GATEWAY_GUILD_MEMBERS: "Intent de membros de servidores",
                    GATEWAY_GUILD_MEMBERS_LIMITED: "Intent de membros de servidores limitada",
                    VERIFICATION_PENDING_GUILD_LIMIT: "Em verificação",
                    //EMBEDDED: "Embed",
                    GATEWAY_MESSAGE_CONTENT: "Intent de Conteúdo de Mensagens",
                    GATEWAY_MESSAGE_CONTENT_LIMITED: "Intent de Conteúdo de Mensagens limitada"
                }
    
                // @ts-ignore
                let array = Object.entries(intents).map(([key, value]) => json.flags & value ? `✅ ${translatedIntents[key]}` : `❌ ${translatedIntents[key]}`)
                array.push(`${json.bot_public ? "✅" : "❌"} Público`)
                array.push(`${json.bot_require_code_grant ? "✅" : "❌"} Requer código de Autenticação via OAuth2`)
                array.push(`${flags?.includes("BotHTTPInteractions") ? "✅" : "❌"} Usa interações HTTP`)
    
                let botEmbed = new EmbedBuilder()
                botEmbed.setAuthor({ name: "Informações da aplicação" })
                botEmbed.setTitle(json.name)
                botEmbed.setDescription(json.description ? json.description : "Nenhuma descrição")
                botEmbed.setColor(m?.roles.highest.color ?? "#80088b")
                botEmbed.addFields([
                    {
                        name: ":id: Servidor de suporte",
                        value: `\`${json.guild_id ? json.guild_id : "Não possui"}\``,
                        inline: true
                    },
                    {
                        name: ":label: Marcadores",
                        value: json.tags ? json.tags.join(", ") : "Não há marcadores",
                        inline: true
                    },
                    {
                        name: ":bug: Slug",
                        value: json?.slug ?? "Não possui",
                        inline: true
                    },
                    {
                        name: "Informações úteis",
                        value: array.join("\n"),
                        inline: false
                    },
                    {
                        name: "Chave de requisição HTTP",
                        value: "`" + json?.verify_key + "`",
    
                    }
                ])

                let embed = new EmbedBuilder()
                embed.setDescription([
                    `ID: **${m?.user.id}** ${nitro}${flags?.map(flag => emojis[flag]).join("") ?? ""}${interaction.guild?.ownerId == m?.user.id ? "👑" : ""}`,
                    `Criado em: **${m?.user.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**`,
                    `Entrou em: **${m?.joinedAt?.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**`,
                    `Ordem de entrada: ${sort.slice(startingValue, endingValue).map(u => u.tag).join(" > ")}`
                ].join("\n"))
    
                embed.setColor(m?.roles.highest.color ?? "#80088b")
                embed.setThumbnail(m?.displayAvatarURL({ forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")

                interaction.followUp({
                    content: `${m?.user.bot ? "🤖" : "👤"} | Informações de ${m?.user.tag}`,
                    embeds: [embed, botEmbed]
                })
                
                return;
            }

            let embed = new EmbedBuilder()
            embed.setDescription([
                `ID: **${m?.user.id}** ${nitro}${flags?.map(flag => emojis[flag]).join("") ?? ""}${interaction.guild?.ownerId == m?.user.id ? "👑" : ""}`,
                `Criado em: **${m?.user.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**`,
                `Entrou em: **${m?.joinedAt?.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}**`,
                `Ordem de entrada: ${sort.slice(startingValue, endingValue).map(u => u.tag).join(" > ")}`
            ].join("\n"))

            embed.setColor(m?.roles.highest.color ?? "#80088b")
            embed.setThumbnail(m?.displayAvatarURL({ forceStatic: false }) ?? "https://cdn.discordapp.com/embed/avatars/0.png")

            interaction.followUp({
                content: `${m?.user.bot ? "🤖" : "👤"} | Informações de ${m?.user.tag}`,
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