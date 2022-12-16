import {ChatInputCommandInteraction} from 'discord.js';
import {CustomClient} from './CustomClient';

/**
 * Interface for a command run options.
 */
export interface CommandRunOptions {
  /**
   * The client which is running the command.
   */
  client: CustomClient;
  /**
   * The interaction object.
   */
  interaction: ChatInputCommandInteraction;
}

type CommandAutoReplyOptionsNoAutoDefer = {
  autoDefer: false;
  autoEphemeral: false;
};

type CommandAutoReplyOptionsAutoDefer = {
  autoDefer: true;
  autoEphemeral: boolean;
};

export type CommandAutoReplyOptions =
  | CommandAutoReplyOptionsNoAutoDefer
  | CommandAutoReplyOptionsAutoDefer;

export interface CommandOptions {
  name: string;
  description: string;
  category: string;
  ownerOnly: boolean;
  replyOptions?: CommandAutoReplyOptions;
}

/**
 * Interface for a command.
 */
export abstract class Command {
  data!: CommandOptions;
  constructor(_options: CommandOptions) {}
  abstract run(_options: CommandRunOptions): Promise<unknown> | unknown;
}
