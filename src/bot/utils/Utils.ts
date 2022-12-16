import {Command as CommandClass} from '#types/commands';
import {CustomClient} from '#types/CustomClient';
import Cluster from 'discord-hybrid-sharding';
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
    client.cluster = new Cluster.Client(client);
    client.commands = new Map();
    client.modules = new Map();

    this.run();
  }

  async run() {
    this.loadCommands();
    this.loadEvents();
  }

  async loadCommands() {
    const commandCategories = await readdir('./bot/commands/');
    for await (const category of commandCategories) {
      const commandFiles = await readdir(`./bot/commands/${category}/`);
      for await (const file of commandFiles) {
        const {default: Command} = await import(`../commands/${category}/${file}`);
        const command: CommandClass = new Command();
        this.client.commands.set(command.data.name, command);
      }
    }
  }

  async loadEvents() {
    const eventFiles = await readdir('./bot/events/');
    for await (const file of eventFiles) {
      const {default: Event} = await import(`../events/${file}`);
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
