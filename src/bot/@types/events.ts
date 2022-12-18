import {ClientEvents} from 'discord.js';
import {CustomClient} from './CustomClient';

export abstract class Event<T extends keyof ClientEvents> {
  abstract get name(): T;
  // eslint-disable-next-line max-len
  public abstract run(client: CustomClient, ...args: ClientEvents[T]): Promise<unknown> | unknown;
}
