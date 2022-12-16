import {Client} from 'discord.js';
import {ClusterClient} from 'discord-hybrid-sharding';
import {Utils} from '../utils/Utils';
import {CommandManager} from '../managers/CommandManager';
import {EventManager} from '../managers/EventManager';

type CustomClient = Client & {
  cluster: ClusterClient;
  modules: Map<string, (...args: unknown) => unknown>;
  managers: {
    commands: CommandManager;
    events: EventManager;
  };
  utils: Utils;
};
