import { Message } from 'discord.js';
import { IBotCommand } from '../bot/IBotCommand';

export const command: IBotCommand = {
    name: 'ping',
    description: 'Responde com Pong!',
    allowedBy: new Set(['all']), // Permissão para todos

    async execute(message: Message, args: string[]) {
        await message.reply('Pong!');
    },
};
