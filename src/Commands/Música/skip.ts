import { GuildMember } from "discord.js"
import Player from "../../LavalinkManager/Player"
import Command, { RunCommand } from "../../Structures/Command"
import EclipseClient from "../../Structures/EclipseClient"

export default class skipCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "skip",
            description: "Inicia uma votação para pular a música atual",
            category: "Música"
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const member = interaction.member as GuildMember
        const memberCount = member.voice.channel!.members.size - 1
        const player = this.client.music.players.get(interaction.guild!.id) as Player

        if (memberCount === 1) {
            player?.stop()
            interaction.followUp({
                content: `✅ | Pulando **${player?.queue.current?.title}**`
            })

            return;
        }

        let required;
        memberCount % 2 == 0 ? required = Math.ceil(memberCount / 2) + 1 : required = Math.ceil(memberCount / 2)

        if (player.skipVotes.includes(interaction.user.id)) {
            interaction.followUp({
                content: `:x: | Você ja votou para pular está música \`[${player.skipVotes.length} votos, ${player.skipVotes.length}/${required} necessários]\``
            })

            return;
        }

        player.skipVotes.push(interaction.user.id)

        var str = "";

        str += `✅ | Você votou para pular a música \`[${player.skipVotes.length} votos, ${player.skipVotes.length}/${required} necessários]\`\n`;

        if (player.skipVotes.length >= required) {
            this.client.utils.resetVotes(player as Player)
            player!.stop()
            str += `✅ | Pulando **${player?.queue.current?.title}**`
        }

        interaction.followUp({
            content: str
        })
    }
}