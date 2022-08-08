import Command, { RunCommand } from "../../../Structures/Command"
import EclipseClient from "../../../Structures/EclipseClient"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember } from "discord.js"

export default class UserAvatarSubCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "user_avatar",
            category: "Utilitários",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

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

        if (member?.avatar) {

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