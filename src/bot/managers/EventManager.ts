import {CustomClient} from '#types/CustomClient';
import {readdir} from 'fs/promises';

export class EventManager {
  constructor(public client: CustomClient) {}

  async loadEvents() {
    const eventFiles = await readdir('./bot/events/');
    for await (const file of eventFiles) {
      const {default: EventClass} = await import(`../events/${file}`);
      // set type to new EventClass() to make sure it's an Event
      const event = new EventClass();

      // If the event should only be executed once
      if (event.data.once) {
        this.client.once(event.data.name, event.run.bind(null, this.client));
      } else this.client.on(event.data.name, event.run.bind(null, this.client));
    }
  }

  async reloadEvents() {
    this.client.removeAllListeners();
    this.loadEvents();
  }
}
