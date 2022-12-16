import {CustomClient} from '#types/CustomClient';
import {readdir} from 'fs/promises';

/**
 * Class that contains all the utility functions, like:
 *  - Loading commands
 *  - Loading events
 *  - Loading the database
 *  - Loading modules, etc.
 */
export class Utils {
  constructor(public client: CustomClient) {
    client.commands = new Map();
    client.modules = new Map();

    this.run();
  }

  async run() {
    this.loadCommands();
    this.loadEvents();
  }

  async loadCommands() {
    const commandFiles = await readdir('./bot/commands/');
    for await (const file of commandFiles) {
      const command = await import(`../commands/${file}`);
      this.client.commands.set(command.name, command);
    }
  }

  async loadEvents() {
    const eventFiles = await readdir('./bot/events/');
    for await (const file of eventFiles) {
      const Event = await import(`../events/${file}`);
      const event = new Event();
      this.client.on(event.name, event.run.bind(null, this.client));
    }
  }

  async reloadCommands() {
    this.client.commands.clear();
    this.loadCommands();
  }

  async reloadEvents() {
    this.client.removeAllListeners();
    this.loadEvents();
  }

  async reloadAll() {
    this.reloadCommands();
    this.reloadEvents();
  }

  connect(token: string) {
    this.client.login(token);
  }
}
