import { Message } from 'discord.js';
import { BotCommand } from './IBotCommand';

export const command: BotCommand = {
    name: 'ping',
    description: 'Responde com Pong!',
    allowedBy: new Set(['all']), // Permissão para todos

    async execute(message: Message, args: string[]) {
        await message.reply('Pong!');
    },
};
