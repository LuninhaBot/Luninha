import {CustomClient} from '#types/CustomClient';
import {Event} from '#types/events.js';

export default class ReadyEvent extends Event<'ready'> {
  get name() {
    return 'ready' as const;
  }

  run(client: CustomClient) {
    console.log(`Logged in as ${client.user!.tag}!`);
  }
}
