import LuninhaClient from "../../../Structures/LuninhaClient"
import Command, { RunCommand } from "../../../Structures/Command"
import { GuildMember } from "discord.js"

export default class BanUserSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "ban_user",
            description: "Bane um usuário do servidor.",
            category: "Moderação",
            showInHelp: false,
        })
    }

    async run({ interaction }: RunCommand) {
        
        const member = interaction.options.getMember("usuario") as GuildMember
        const user = member.user ?? interaction.options.getUser("user", true)

        if (user.id == this.client.user?.id) {
            interaction.followUp({
                content: ":x: » Você não pode me punir!",
            })

            return;
        }

        if (user.id == interaction.user.id) {
            interaction.followUp({
                content: ":x: » Você não pode punir você mesmo!",
            })

            return;
        }

        if (member.roles) {
            const guildMember = interaction.member as GuildMember

            if (!member.bannable || member.roles.highest.position >= interaction.guild!.members.me!.roles.highest.position) {
                interaction.editReply(`:x: » Esté usuário não pode ser punido!`)
                return;
            }

            if (guildMember.roles.highest.position <= member.roles.highest.position) {
                interaction.editReply(`:x: » Não tenho permissão para punir este usuário!`)

                return;
            }
        }

        await interaction.guild!.bans.create(user.id, {
            reason: interaction.options.getString("motivo", false) ?? "Nenhum motivo foi fornecido."
        }).catch(() => {

            interaction.followUp({
                content: ":x: » Não foi possível punir este usuário!"
            })

            return;
        })

        interaction.followUp(`✅ » Usuário ${user.tag} ( ID: ${user.id} ) banido com sucesso!`)
    }
}