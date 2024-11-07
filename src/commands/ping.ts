import { Message } from 'discord.js';
import { IBotCommand } from '../bot/botcommand.interface';

export const command: IBotCommand = {
    group: 'general',
    name: 'ping',
    description: 'Responde com Pong!',
    allowedBy: new Set(['all']),
    usage: `
**!ping**
- Responde com "Pong!" para verificar se o bot está ativo.
- **Exemplo**: \`!ping\`
`,


    async execute(message: Message, args: string[]) {
        await message.reply('Pong!');
    },
};
