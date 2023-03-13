import {ChatInputCommandInteraction} from 'discord.js';
import {CommandCategoriesKeys, CommandDescriptionsKeys, CommandNamesKeys} from '../managers/LocaleManager';
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

interface CommandAutoReplyOptionsNoAutoDefer {
  autoDefer: false | undefined;
  autoEphemeral: false;
}

interface CommandAutoReplyOptionsAutoDefer {
  autoDefer: true;
  autoEphemeral: boolean;
}

export type CommandAutoReplyOptions =
  | CommandAutoReplyOptionsNoAutoDefer
  | CommandAutoReplyOptionsAutoDefer;

export interface CommandOptions {
  name: CommandNamesKeys | '';
  description: CommandDescriptionsKeys | '';
  category: CommandCategoriesKeys | '';
  ownerOnly: boolean;
  replyOptions?: CommandAutoReplyOptions;
}

/**
 * Interface for a command.
 */
export abstract class Command {
  data!: CommandOptions;
  constructor(_options: CommandOptions) {
    this.data = _options;
  }
  abstract run(_options: CommandRunOptions): Promise<unknown> | unknown;
}

export interface CommandClass extends Command {
  data: CommandOptions;
  new (): Command;
  run(_options: CommandRunOptions): Promise<unknown> | unknown;
}
