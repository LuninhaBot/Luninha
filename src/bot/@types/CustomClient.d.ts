import {Client} from 'discord.js';
import {ClusterClient} from 'discord-hybrid-sharding';
import {Utils} from '../utils/Utils';

type CustomClient = Client & {
  cluster: ClusterClient;
  commands: Map<string, Command>;
  modules: Map<string, (...args: unknown) => unknown>;
  utils: Utils;
};
