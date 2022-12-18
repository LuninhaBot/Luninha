import {CustomClient} from '#types/CustomClient';
import {Event} from '#types/events.js';

export default class ReadyEvent extends Event<'ready'> {
  constructor() {
    super({name: 'ready'});
  }

  run(client: CustomClient) {
    console.log(`Logged in as ${client.user!.tag}!`);
    client.application?.commands.set([
      {
        name: 'ping',
        description: 'Replies with pong!',
      },
    ]);
  }
}
