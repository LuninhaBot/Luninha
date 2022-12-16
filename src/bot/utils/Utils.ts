import {CustomClient} from '#types/CustomClient';
import Cluster from 'discord-hybrid-sharding';
import {CommandManager} from '../managers/CommandManager.js';
import {EventManager} from '../managers/EventManager.js';

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
    client.modules = new Map();
    client.managers = {
      commands: new CommandManager(client),
      events: new EventManager(client),
    };

    this.run();
  }

  async run(isReload = false) {
    this.client.managers.commands.loadCommands();
    this.client.managers.events.loadEvents();
    if (!isReload) {
      // TODO: Load databases, locales, etc.
    }
  }

  async reloadCommands() {
    this.client.managers.commands.clear();
    this.run(true);
  }

  async reloadEvents() {
    this.client.removeAllListeners();
    this.run(true);
  }

  connect(token: string) {
    this.client.login(token);
  }
}
