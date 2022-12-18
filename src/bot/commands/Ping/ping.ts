import {Command, CommandRunOptions} from '#types/commands.js';

export default class PingCommand extends Command {
  constructor() {
    super({
      name: 'ping',
      description: 'Example command',
      category: 'Example',
      ownerOnly: false,
    });
  }

  run({interaction}: CommandRunOptions) {
    interaction.reply('Hello, world!');
  }
}
