// ./src/commands/task-delete.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotCommand = {
    group: 'todo',
    name: 'task-delete',
    description: 'Deleta uma tarefa pelo código.',
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca', ]),
    usage: `
**!task-delete** \`<código>\`
- Remove uma tarefa específica pelo código.
- **Exemplo**: \`!task-delete T123\`
`,

    async execute(message: Message, args: string[]) {
        const [code] = args;

        if (!code) {
            return message.reply('Por favor, forneça o código da tarefa para deletar. Uso: !task-delete <código>');
        }

        const todo = await todoService.deleteTodo(message.author.id, code);

        if (!todo) {
            return message.reply('Tarefa não encontrada.');
        }

        message.reply(`Tarefa deletada com sucesso: ${todo.description}`);
    },
};
