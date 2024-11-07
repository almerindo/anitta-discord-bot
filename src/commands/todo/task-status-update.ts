// ./src/commands/task-update.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';
import { ETodoStatus } from '../../services/todo/models/todo.model';

const todoService = new TodoService();

export const command: IBotCommand = {
    group: 'todo',
    name: 'task-status-update',
    description: 'Atualiza o status de uma tarefa para todo, doing ou done.',
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca', ]),
    usage: `
**!task-status-update** \`<código> <todo|doing|done>\`
- Atualiza o status de uma tarefa específica.
- **Exemplo**: \`!task-status-update T123 done\`
`,

    async execute(message: Message, args: string[]) {
        const [code, status] = args;

        if (!code || !status || !Object.values(ETodoStatus).includes(status as ETodoStatus)) {
            return message.reply('Uso: !task-update <código> <todo|doing|done>');
        }

        const todo = await todoService.updateTodoStatus(message.author.id, code, status as ETodoStatus);

        if (!todo) {
            return message.reply('Tarefa não encontrada.');
        }

        message.reply(`Tarefa atualizada: ${todo.description} - Status: ${todo.status}`);
    },
};
