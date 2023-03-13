import {CustomClient} from '#types/CustomClient';
import {EventClass} from '#types/events.js';
import {readdir} from 'fs/promises';

export class EventManager {
  constructor(public client: CustomClient) {}

  async loadEvents() {
    const eventFiles = await readdir('./bot/events/');
    for await (const file of eventFiles) {
      const {default: Event} = await import(`../events/${file}`) as {default: EventClass};
      const event = new Event();

      // If the event should only be executed once
      if (event.data.once) {
        // @ts-expect-error | Because Event is a generic class, we can't use the name property.
        this.client.once(event.data.name, event.run.bind(null, this.client));
        // @ts-expect-error | Because Event is a generic class, we can't use the name property.
      } else this.client.on(event.data.name, event.run.bind(null, this.client));
    }
  }

  reloadEvents() {
    this.client.removeAllListeners();
    this.loadEvents();
  }
}
