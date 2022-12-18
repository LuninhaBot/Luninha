import {CustomClient} from '#types/CustomClient';
import Cluster from 'discord-hybrid-sharding';
import {CommandManager} from '../managers/CommandManager.js';
import {EventManager} from '../managers/EventManager.js';
import {LocaleManager} from '../managers/LocaleManager.js';

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
      languages: new LocaleManager(client),
    };

    this.run();
  }

  async run() {
    this.client.managers.languages.loadLocales();
    this.client.managers.commands.loadCommands();
    this.client.managers.events.loadEvents();
  }

  async reloadCommands() {
    this.client.managers.commands.clear();
    this.client.managers.commands.loadCommands();
  }

  async reloadEvents() {
    this.client.removeAllListeners();
    this.client.managers.events.loadEvents();
  }

  connect(token: string) {
    this.client.login(token);
  }
}
