import {ClientEvents} from 'discord.js';
import {CustomClient} from './CustomClient';

export abstract class Event<T extends keyof ClientEvents> {
  abstract get name(): T;
  abstract run(client: CustomClient, ...args: ClientEvents[T]): Promise<unknown> | unknown;
}


export interface EventClass extends Event<keyof ClientEvents> {
  new (): Event<keyof ClientEvents>;
  get name(): keyof ClientEvents;
  run(client: CustomClient, ...args: ClientEvents[keyof ClientEvents]): Promise<unknown> | unknown;
}
