import { Message } from 'discord.js';

export interface IBotCommand {
    group: string;
    name: string;
    description: string;
    allowedBy?: Set<string>;
    usage: string;
    execute: (message: Message, args: string[]) => Promise<any>;
}
