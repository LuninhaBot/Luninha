import {Client as ClusterClient} from 'discord-hybrid-sharding';
import {Client} from 'discord.js';

type ClientProperties = {
    cluster: ClusterClient;
}

const clusterInfo = ClusterClient.getInfo();


const client = new Client({
  shards: clusterInfo.SHARD_LIST,
  shardCount: clusterInfo.TOTAL_SHARDS,
  intents: 0,
}) as Client & ClientProperties;

client.cluster = new ClusterClient(client);
client.login('');
