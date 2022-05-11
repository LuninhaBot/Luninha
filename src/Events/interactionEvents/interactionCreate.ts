import Event from "../../Structures/Event"
import { Interaction, GuildMember } from "discord.js"
import type { runCommand } from "../../Structures/Command"
import type NFTCordClient from "../../Structures/NFTCordClient"

export default class InteractionCreateEvent extends Event {

    constructor(client: NFTCordClient) {
        super(client, {
            name: "interactionCreate",
        })
    }

    async run(interaction: Interaction) {

        if (interaction.isChatInputCommand()) {

            const command = this.client.commands.get(interaction.commandName) || this.client.commands.get(interaction.options.getSubcommand())

            if (command) {

                command.ephemeral ? await interaction.deferReply({ ephemeral: true, fetchReply: true }) : await interaction.deferReply({ fetchReply: true })

                if (command.ownerOnly && !this.client.utils.checkOwner(interaction.user.id)) {
                    return interaction.followUp(":x: | Você não pode usar este comando!")
                }

                if (!command.guildOnly && !interaction.inGuild()) {
                    return interaction.followUp(":x: | Esté comando não pode ser usado fora de um servidor!")
                }

                if (interaction.inGuild()) {
                    const userPermCheck = command.userPerms || this.client.defaultPerms
                    if (userPermCheck) {
                        const missing = interaction.channel?.permissionsFor(interaction?.member as GuildMember).missing(userPermCheck);
                        if (missing?.length) {
                            return interaction.followUp(`:x: | Você não tem permissão para usar este comando!\n\n${missing.map(this.client.utils.formatPerms)}`)
                        }
                    }
    
                    const botPermCheck = command.botPerms || this.client.defaultPerms
                    if (botPermCheck) {
                        const missing = interaction.channel?.permissionsFor(interaction.guild?.me as GuildMember).missing(botPermCheck)
                        if (missing?.length) {
                            return interaction.followUp(`:x: | Eu não consigo rodar o comando pois não tenho permissão para isso!\n\n${missing.map(this.client.utils.formatPerms)}`)
                        }
                    }
                }

                try {
                    command?.run({ interaction } as runCommand)
                } catch (error) {
                    return interaction.followUp(`⚠️ | Um erro aconteceu\n\`\`\`js\n${error}\`\`\``)
                }
            }
        }
    }
}
