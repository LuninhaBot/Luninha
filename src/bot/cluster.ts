import {Manager} from 'discord-hybrid-sharding';

const manager = new Manager(`${__dirname}/bot.js`, {
  token: '',
  totalShards: 1,
  totalClusters: 1,
  mode: 'process',
});

manager.on('clusterCreate', (cluster) =>
  console.log(`Launched Cluster ${cluster.id}`)
);

manager.spawn({timeout: -1});
