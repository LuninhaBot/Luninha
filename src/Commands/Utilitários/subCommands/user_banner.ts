import Command, { RunCommand } from "../../../Structures/Command"
import LuninhaClient from "../../../Structures/LuninhaClient"
import { EmbedBuilder } from "discord.js"
import fetch from "node-fetch"
import { ClientConfig } from "../../../Utils/Config"

export default class UserBannerSubCommand extends Command {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "user_banner",
            category: "Utilitários",
            showInHelp: false
        })
    }

    async run({ interaction }: RunCommand) {

        const options = interaction.options.getString("usuário", false)
        const id = options?.match(/\d+/g)?.join("") ?? interaction.user.id

        const fe = await fetch(`https://discord.com/api/v10/users/${id}`, {
            headers: {
                "Authorization": `Bot ${ClientConfig.token}`,
                "Content-Type": "application/json"
            }
        })

        const json = await fe.json() as {
            id: string,
            username: string
            avatar: string
            avatar_decoration: string
            discriminator: string
            public_flags: number
            banner: string
            banner_color: string
            accent_color: string
        }

        if (!json.banner) {

            await interaction.deferReply({ ephemeral: true, fetchReply: true })
            interaction.followUp({
                content: `:x: » Esté usuário não possui um banner.`,
            })

            return;
        }

        await interaction.deferReply({ ephemeral: false, fetchReply: true })

        const embed = new EmbedBuilder()
        embed.setColor(this.client.defaultColor)
        embed.setDescription(`🖼️ | Banner de **${json.username}#${json.discriminator}**`)
        embed.setImage(`https://cdn.discordapp.com/banners/${json.id}/${json.banner}.${json.banner.startsWith("a_") ? "gif" : "png"}?size=4096`)

        interaction.followUp({
            embeds: [embed]
        })
    }
}
