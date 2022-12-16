import {CustomClient} from '#types/CustomClient';
import {Event} from '#types/events';

export class ReadyEvent extends Event<'ready'> {
  get name() {
    return 'ready' as const;
  }

  run(client: CustomClient) {
    console.log(`Logged in as ${client.user!.tag}!`);
  }
}
