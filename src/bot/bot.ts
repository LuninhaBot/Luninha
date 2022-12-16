import {CustomClient} from '#types/CustomClient';
import {Client as ClusterClient} from 'discord-hybrid-sharding';
import {Client} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

const clusterInfo = ClusterClient.getInfo();

const client = new Client({
  shards: clusterInfo.SHARD_LIST,
  shardCount: clusterInfo.TOTAL_SHARDS,
  intents: 0,
}) as CustomClient;

client.cluster = new ClusterClient(client);
client.login(process.env.BOT_TOKEN);
