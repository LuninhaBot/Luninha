import {CustomClient} from '#types/CustomClient';
import {CommandClass, Command as AbstractCommand} from '#types/commands';
import {readdir} from 'fs/promises';

export class CommandManager extends Map<string, AbstractCommand> {
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
        ) as {default: CommandClass};

        const command = new Command();
        this.set(command.data.name, command);
      }
    }
  }

  reloadCommands() {
    this.clear();
    this.loadCommands();
  }
}
