import {Client} from 'discord.js';
import {ClusterClient} from 'discord-hybrid-sharding';
import {Utils} from '../utils/Utils';
import {CommandManager} from '../managers/CommandManager';
import {EventManager} from '../managers/EventManager';
import {LocaleManager} from '../managers/LocaleManager';

type CustomClient = Client & {
  cluster: ClusterClient;
  modules: Map<string, (...args: unknown) => unknown>;
  managers: {
    commands: CommandManager;
    events: EventManager;
    languages: LocaleManager;
  };
  utils: Utils;
};
