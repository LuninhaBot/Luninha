import {ClientEvents} from 'discord.js';
import {CustomClient} from './CustomClient';

interface EventData {
  name: keyof ClientEvents;
  once?: boolean;
}

export abstract class Event<T extends keyof ClientEvents> {
  constructor(public data: EventData) {}
  abstract run(
    client: CustomClient,
    ...args: ClientEvents[T]
  ): Promise<unknown> | unknown;
}

export interface EventClass extends Event<keyof ClientEvents> {
  new (): Event<keyof ClientEvents>;
  run(
    client: CustomClient,
    ...args: ClientEvents[keyof ClientEvents]
  ): Promise<unknown> | unknown;
}
