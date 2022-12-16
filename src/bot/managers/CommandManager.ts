import {CustomClient} from '#types/CustomClient';
import {Command as CommandClass} from '#types/commands';
import {readdir} from 'fs/promises';

export class CommandManager extends Map<string, CommandClass> {
  constructor(public client: CustomClient) {
    super();
  }

  async loadCommands() {
    const commandCategories = await readdir('./bot/commands/');

    for await (const category of commandCategories) {
      const commandFiles = await readdir(`./bot/commands/${category}/`);

      for await (const file of commandFiles) {
        const {default: Command} = await import(
            `../commands/${category}/${file}`
        );

        const command: CommandClass = new Command();
        this.set(command.data.name, command);
      }
    }
  }

  async reloadCommands() {
    this.clear();
    this.loadCommands();
  }
}
