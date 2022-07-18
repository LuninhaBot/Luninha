import { inspect } from "util"
import EclipseClient from "../../Structures/EclipseClient"
import Command, { RunCommand } from "../../Structures/Command"
import player from "../../LavalinkManager/Player"

export default class EvalCommand extends Command {
    constructor(client: EclipseClient) {
        super(client, {
            name: "eval",
            description: "Executa código typescript",
            category: "Desenvolvedor",
            ownerOnly: true
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ ephemeral: true })

        const clean = (text: string) => {
            if (typeof text === "string") {
                text
                    .slice(0, 1970)
                    .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                    .replace(/@/g, `@${String.fromCharCode(8203)}`);
            }
            return text;
        }

        try {
            const evaluate = await eval(interaction.options.getString("code", true))

            interaction.followUp({
                content: `\`\`\`ts\n${clean(inspect(evaluate, { depth: 0 }).slice(0, 1970))}\n\`\`\``
            })
        } catch (e) {
            interaction.followUp({
                content: `\`\`\`ts\n${(e)}\`\`\``
            })
        }
    }
}