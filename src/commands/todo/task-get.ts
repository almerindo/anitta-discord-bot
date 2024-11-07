// ./src/commands/task-get.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotCommand = {
    group: 'todo',
    name: 'task-get',
    description: 'Mostra os detalhes de uma tarefa específica pelo código.',
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca', ]),
    usage: `
**!task-get** \`<código>\`
- Exibe os detalhes de uma tarefa específica pelo código.
- **Exemplo**: \`!task-get T123\`
`,

    async execute(message: Message, args: string[]) {
        const [code] = args;

        if (!code) {
            return message.reply('Uso: !task-get <código>');
        }

        const todo = await todoService.getTodoByCode(message.author.id, code);

        if (!todo) {
            return message.reply('Tarefa não encontrada.');
        }

        message.reply(`Tarefa: ${todo.description} - Status: ${todo.status}`);
    },
};
