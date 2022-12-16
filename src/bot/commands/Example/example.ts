import {Command, CommandRunOptions} from '#types/commands';

export class ExampleCommand extends Command {
  constructor() {
    super({
      name: 'example',
      description: 'Example command',
      category: 'Example',
      ownerOnly: false,
    });
  }

  override run({interaction}: CommandRunOptions) {
    interaction.reply('Hello, world!');
  }
}
