import { Message } from 'discord.js';

export const command = {
    name: 'ping',
    description: 'Responde com Pong!',
    async execute(message: Message, args: string[]) {
        message.reply('Pong!');
    },
};
