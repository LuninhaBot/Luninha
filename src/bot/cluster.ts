import {Manager} from 'discord-hybrid-sharding';
import dotenv from 'dotenv';
// @ts-ignore | Sometimes config.json may not exist
import Configuration from '../../config.json' assert {type: 'json'};

dotenv.config({path: '../../.env'});

const manager = new Manager('./bot/bot.js', {
  token: '',
  totalShards: Configuration.shardCount,
  totalClusters: Configuration.clusterCount,
  mode: 'process',
});

manager.on('clusterCreate', (cluster) =>
  console.log(`Launched Cluster ${cluster.id}`)
);

manager.spawn({timeout: -1});
