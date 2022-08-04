import Event from "../../Structures/Event"
import { Interaction, GuildMember, ChatInputCommandInteraction, PermissionsBitField } from "discord.js"
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class InteractionCreateEvent extends Event {


    constructor(client: EclipseClient) {
        super(client, {
            name: "interactionCreate",
        })
    }

    async run(interaction: Interaction) {

        if (interaction.isChatInputCommand()) {

            const command = this.client.commands.get(interaction.commandName) ?? this.client.commands.get(interaction.options.getSubcommand())

            if (command) {

                if (command.ownerOnly && !this.client.utils.checkOwner(interaction.user.id)) {
                    await interaction.deferReply({ ephemeral: true })

                    interaction.followUp(":x: | Você não pode usar este comando!")

                    return;
                }

                const member = interaction.member as GuildMember
                let role = interaction.guild?.roles.cache.get(db.get(`${interaction.guild?.id}.dj`))?.name ?? "DJ"

                if (command.djOnly && !member?.roles.cache.has(db.get(`${interaction.guild?.id}.dj`))) {
                    await interaction.deferReply({ ephemeral: true })

                    interaction.followUp({
                        content: `:x: | Apenas pessoas com o cargo \`${role}\` podem usar este comando!`,
                    })

                    return;
                }

                if (!interaction?.inGuild()) {
                    await interaction.deferReply({ ephemeral: true })

                    interaction.followUp(":x: | Esté comando não pode ser usado fora de um servidor!")

                    return;
                }

                if (interaction?.inGuild()) {
                    if (!InteractionCreateEvent.checkBotPermissions(interaction, command)) return;
                    if (!InteractionCreateEvent.checkMemberPermissions(interaction, command)) return;
                }

                try {
                    command?.run({ interaction } as RunCommand)
                } catch (error) {
                    await interaction.deferReply({ ephemeral: true })

                    interaction.followUp(`⚠️ | Um erro aconteceu\n\`\`\`js\n${error}\`\`\``)

                    return;
                }
            }
        }
    }

    static checkBotPermissions(interaction: ChatInputCommandInteraction, command: Command): boolean {
        if (command.botPerms.length == 0) return true;
        if (!interaction.guild?.members.me?.permissions.has(command.botPerms)) {
            const permissions = new PermissionsBitField(command.botPerms)
                .toArray()
                .map(p => p)
                .join(', ')
            interaction.reply({
                content: `❌ | Está me faltando permissões para rodar o comando \`${permissions.toString()}\``,
                ephemeral: true
            })
            return false;
        }
        return true;
    }

    static checkMemberPermissions(interaction: ChatInputCommandInteraction, command: Command): boolean {
        if (command.userPerms.length == 0) return true;
        if (!(interaction.member as GuildMember).permissions.has(command.userPerms)) {
            const permissions = new PermissionsBitField(command.userPerms)
                .toArray()
                .map(p => p)
                .join(', ')
                
            interaction.reply({
                content: `❌ | Você não pode usar esté comando pois está te faltando permissões \`${permissions.toString()}\``,
                ephemeral: true
            })
            return false;
        }
        return true;
    }
}