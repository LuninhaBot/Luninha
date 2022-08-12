import Command, { RunCommand } from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"
import { GuildMember, PermissionFlagsBits } from "discord.js"
import dayjs from "dayjs"
import ms from "ms"

export default class MuteCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "mute",
            description: "Muta um usuário do servidor.",
            category: "Moderação",
            usage: "<usuário> <tempo ( 1day, 1hour )> [motivo]",
            userPerms: [
                PermissionFlagsBits.ModerateMembers
            ],
            botPerms: [
                PermissionFlagsBits.ModerateMembers
            ],
            marks: {
                isNew: true
            }
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })


        const member = interaction.options.getMember("usuario") as GuildMember
        const date = ms(interaction.options.getString("tempo", true))

        if (member.user.id == this.client.user?.id) {
            interaction.followUp({
                content: ":x: » Você não pode me punir!",
            })

            return;
        }
        if (member.user.id == interaction.user.id) {
            interaction.followUp({
                content: ":x: » Você não pode punir você mesmo!",
            })

            return;
        }
        if (member.roles) {
            const guildMember = interaction.member as GuildMember

            if (!member.moderatable || member.roles.highest.position >= interaction.guild!.members.me!.roles.highest.position) {
                interaction.editReply(`:x: » Esté usuário não pode ser punido!`)
                return;
            }

            if (guildMember.roles.highest.position <= member.roles.highest.position) {
                interaction.editReply(`:x: » Não tenho permissão para punir este usuário!`)

                return;
            }
        }

        const finalDate = dayjs().add(date, 'milliseconds').toDate()

        await interaction.guild!.members.edit(member.user.id, {
            reason: interaction.options.getString("motivo") ?? "Nenhum motivo foi especificado.",
            communicationDisabledUntil: finalDate
        }).catch(() => {
            interaction.followUp({
                content: `:x: » Não foi possível mutar este usuário!`
            })

            return;
        })

        interaction.followUp({
            content: `:white_check_mark: » O usuário ${member.user.tag} ( ID: ${member.id} ) foi mutado com sucesso!`
        })

    }
}