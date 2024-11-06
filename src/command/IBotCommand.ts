import { Message } from 'discord.js';

export interface BotCommand {
    name: string;
    description: string;
    allowedBy?: Set<string>;
    execute: (message: Message, args: string[]) => Promise<any>;
}
