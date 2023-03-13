import {CustomClient} from '#types/CustomClient';
import {Event} from '#types/events.js';
import {Interaction} from 'discord.js';

export default class ChatInputCommandInteractionEvent extends Event<'interactionCreate'> {
  constructor() {
    super({name: 'interactionCreate'});
  }

  run(client: CustomClient, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.managers.commands.get(interaction.commandName);
    if (!command) return;

    try {
      command.run({client, interaction});
    } catch (error) {
      interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
}
