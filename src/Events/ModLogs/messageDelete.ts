import Event from "../../Structures/Event"
import LuninhaClient from "../../Structures/LuninhaClient"
import { Message, EmbedBuilder, TextChannel, escapeMarkdown } from "discord.js"

export default class MessageDeleteEvent extends Event {
    constructor(client: LuninhaClient) {
        super(client, {
            name: "messageDelete"
        })
    }

    async run(message: Message) {

        const channel = this.client.channels.cache.get(db.get(`${message.guild!.id}.modlogs`)) as TextChannel

        if (channel) {

            if (message.author.bot) return;

            if (message.stickers?.size) return;
    
            if (message.attachments?.size) return;
    
            const date = new Date().toLocaleString("pt-BR", { 
                timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit" 
            })
    
            const embed = new EmbedBuilder()
            embed.setColor(this.client.defaultColor)
            embed.setDescription(escapeMarkdown(message?.content.slice(0, 2000) ?? "Falha ao obter mensagem"))

            
            channel.send({
                content: `\`[${date}]\`\nMensagem de ${message.author ? message.author.tag : "Error#0000"} (ID: ${message.author ? message.author.id : "00"}) foi deletada em <#${message.channelId}>`,
                embeds: [embed]
            })
        } else { return; }
    }
}