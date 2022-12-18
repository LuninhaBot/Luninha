import {ClientEvents} from 'discord.js';
import {CustomClient} from './CustomClient';

interface EventData {
  name: keyof ClientEvents;
  once?: boolean;
}

export abstract class Event<T extends keyof ClientEvents> {
  constructor(public data: EventData) {}
  // eslint-disable-next-line max-len
  public abstract run(client: CustomClient, ...args: ClientEvents[T]): Promise<unknown> | unknown;
}
