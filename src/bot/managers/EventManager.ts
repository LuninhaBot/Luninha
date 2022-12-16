import {CustomClient} from '#types/CustomClient';
import {readdir} from 'fs/promises';

export class EventManager {
  constructor(public client: CustomClient) {}

  async loadEvents() {
    const eventFiles = await readdir('./bot/events/');
    for await (const file of eventFiles) {
      const {default: Event} = await import(`../events/${file}`);
      const event = new Event();
      this.client.on(event.name, event.run.bind(null, this.client));
    }
  }

  async reloadEvents() {
    this.client.removeAllListeners();
    this.loadEvents();
  }
}
