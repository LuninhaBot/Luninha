import {CustomClient} from '#types/CustomClient';
import Cluster from 'discord-hybrid-sharding';
import {Client, GatewayIntentBits} from 'discord.js';
import dotenv from 'dotenv';
import {Utils} from './utils/Utils.js';

dotenv.config({path: '../.env'});

const clusterInfo = Cluster.Client.getInfo();

const client = new Client({
  shards: clusterInfo.SHARD_LIST,
  shardCount: clusterInfo.TOTAL_SHARDS,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
}) as CustomClient;

client.utils = new Utils(client);
client.utils.connect(process.env.BOT_TOKEN);
