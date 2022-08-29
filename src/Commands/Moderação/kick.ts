import Command, { RunCommand } from "../../Structures/Command"
import LuninhaClient from "../../Structures/LuninhaClient"
import { GuildMember, PermissionFlagsBits } from "discord.js"

export default class BanCommands extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "kick",
            description: "Expulsa um usuário do servidor.",
            category: "Moderação",
            usage: "<usuário> [motivo]",
            userPerms: [
                PermissionFlagsBits.KickMembers
            ],
            botPerms: [
                PermissionFlagsBits.KickMembers
            ]
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: true, fetchReply: true })

        const member = interaction.options.getMember("usuario") as GuildMember

        if (!member) {
            interaction.followUp({
                content: ":x: » Não foi possível encontrar o usuário!",
            })

            return;
        }

        if (member.id == this.client.user?.id) {
            interaction.followUp({
                content: ":x: » Você não pode me punir!",
            })

            return;
        }

        if (member.id == interaction.user.id) {
            interaction.followUp({
                content: ":x: » Você não pode punir você mesmo!",
            })

            return;
        }

        if (member.roles) {
            if (!member.kickable || member.roles.highest.position >= interaction.guild!.members.me!.roles.highest.position) {
                interaction.followUp({
                    content: ":x: » Esté usuário não pode ser expulso!",
                })

                return;
            }

            if (member.roles.highest.position <= member.roles.highest.position) {
                interaction.followUp({
                    content: `❌ » Não tenho permissão para expulsar este usuário!`
                })

                return;
            }
        }

        await member.kick(interaction.options.getString("motivo", false) ?? "Nenhum motivo foi fornecido.").catch(() => {
            interaction.followUp({
                content: ":x: » Não foi possível expulsar este usuário!",
            })
        })

        interaction.followUp({
            content: `✅ » Usuário ${member.user.tag} ( ID: ${member.id} ) expulso com sucesso!`
        })
    }
}