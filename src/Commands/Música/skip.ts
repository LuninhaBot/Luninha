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

        let member = await interaction.guild?.members.fetch(interaction.user.id)
        // @ts-ignore
        let memberCount = member?.voice.channel?.members.size - 1
        let player = this.client.music.players.get(interaction.guild?.id ?? "")

        if (memberCount === 1) {
            player?.stop()
            interaction.followUp({
                content: `✅ | Pulando **${player?.queue.current?.title}**`
            })
        }

        let required;
        memberCount % 2 == 0 ? required = Math.ceil(memberCount / 2) + 1 : required = Math.ceil(memberCount / 2)

        // @ts-ignore
        if (player.skipVotes.includes(interaction.user.id)) {
            interaction.followUp({
                // @ts-ignore
                content: `:x: | Você ja votou para pular está música \`[${player.skipVotes.length} votos, ${player.skipVotes.length}/${required} necessários]\``
            })
        }

        // @ts-ignore
        player.skipVotes.push(interaction.user.id)

        var str = "";

        // @ts-ignore
        str += `✅ | Você votou para pular a música \`[${player.skipVotes.length} votos, ${player.skipVotes.length}/${required} necessários]\`\n`;

        // @ts-ignore
        if (player.skipVotes.length >= required) {
            // @ts-ignore
            this.client.utils.resetVotes(player)
            player?.stop()
            str += `✅ | Pulando **${player?.queue.current?.title}**`;
        };

        interaction.followUp({
            content: str
        })
    }
}