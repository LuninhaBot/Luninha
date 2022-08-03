import Event from "../../Structures/Event"
import EclipseClient from "../../Structures/EclipseClient"
import { Message, EmbedBuilder, TextChannel, escapeMarkdown } from "discord.js"

export default class MessageUpdateEvent extends Event {
    constructor(client: EclipseClient) {
        super(client, {
            name: "messageUpdate"
        })
    }

    async run(oldMessage: Message, newMessage: Message) {

        if (newMessage?.author?.bot) return;

        if (oldMessage.content == newMessage.content) return;

        if (oldMessage.attachments?.size) return;

        const date = new Date().toLocaleString("pt-BR", { 
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit" 
        })

        const embed = new EmbedBuilder()
        embed.setColor("#04c4e4")
        embed.setDescription(`[Link da mensagem](${newMessage.url})`)
        embed.addFields([
            { name: "Mensagem antiga", value: escapeMarkdown(oldMessage.content ?? "Falha ao obter mensagem") },
            { name: "Nova mensagem", value: escapeMarkdown(newMessage.content)}
        ])

        const channel = this.client.channels.cache.get(db.get(`${newMessage.guild!.id}.modlogs`) as string) as TextChannel
        if (channel) {
            channel.send({
                content: `\`[${date}]\`\nMensagem de ${newMessage ? newMessage.author.tag : "Error#0000"} (ID: ${newMessage ? newMessage.author.id : "00"}) foi editada em <#${newMessage.channelId}>`,
                embeds: [embed]
            })
        } else { return; }
    }
}