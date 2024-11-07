// ./src/commands/help.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../bot/botcommand.interface';
import { Client } from 'discord.js';

export const command: IBotCommand = {
    name: 'help',
    group: 'general',
    description: 'Exibe a sintaxe de todos os comandos, agrupados por categoria.',
    allowedBy: new Set(['all']),
    usage: `
**!help**
- Exibe a sintaxe de todos os comandos de tarefas, agrupados por categoria.
- **Exemplo**: \`!help\`
`,


    async execute(message: Message) {
        const client = message.client as Client & { commands: Map<string, IBotCommand> };
        const groupedCommands: { [key: string]: IBotCommand[] } = {};

        // Agrupa comandos por `group`
        client.commands.forEach((cmd) => {
            if (!groupedCommands[cmd.group]) {
                groupedCommands[cmd.group] = [];
            }
            groupedCommands[cmd.group].push(cmd);
        });

        // Cria a mensagem de ajuda agrupada por categoria
        let helpMessage = '**Lista de Comandos**\n\n';
        for (const group in groupedCommands) {
            helpMessage += `----------\n **Group: ${group}**\n ----------\n`;
            groupedCommands[group].forEach((cmd) => {
                helpMessage += `\n${cmd.usage}\n`;
            });
            helpMessage += '\n'; // Separador entre grupos
        }

        message.reply(helpMessage);
    },
};
