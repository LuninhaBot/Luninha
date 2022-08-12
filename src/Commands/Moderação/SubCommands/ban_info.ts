import LuninhaClient from "../../../Structures/LuninhaClient"
import Command, { RunCommand, RunAutoComplete } from "../../../Structures/Command"
import { EmbedBuilder, PermissionFlagsBits } from "discord.js"


export default class BanInfoSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "ban_info",
            description: "Mostra informações sobre um usuário banido.",
            category: "Moderação",
            showInHelp: false,
        })
    }

    async run({ interaction }: RunCommand) {

        await interaction.deferReply({ fetchReply: true })

        const id = interaction.options.getString("usuario", true)

        if (id == "undefined") {
            interaction.followUp(`:x: » Não foi localizado nenhum banimento`)

            return;
        }

        const ban = await interaction.guild!.bans.fetch(id).catch(() => { })

        if (!ban) {
            interaction.followUp(`:x: » Não foi localizado nenhum banimento`)

            return;
        }

        const embed = new EmbedBuilder()
        embed.setColor(this.client.defaultColor)
        embed.setTitle(`Informações do banimento`)
        embed.setDescription([
            `Usuário: **${ban.user.tag}** ( ID: ${ban.user.id} )`,
            `Motivo: **${ban.reason ?? "Nenhum motivo informado"}**`,
        ].join("\n"))

        interaction.followUp({
            embeds: [embed]
        })

    }

    async runAutoComplete({ interaction }: RunAutoComplete) {

        if (!interaction.memberPermissions!.has(PermissionFlagsBits.BanMembers) && !interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.BanMembers)) {
            interaction.respond([]);
            return;
        }

        const banList = await interaction.guild!.bans.fetch({ cache: true, limit: 25 }).catch(() => { })

        if (!banList || banList.size == 0) {
            interaction.respond([{ value: "undefined", name: `Não foi localizado nenhum banimento` }]);
            return;
        }

        interaction.respond(banList.map(ban => ({ value: ban.user.id, name: ban.user.tag })));
    }
}