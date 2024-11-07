// ./src/commands/task-text-update.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotCommand = {
    name: 'task-text-update',
    description: 'Atualiza o texto (descrição) de uma tarefa específica pelo código.',
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca', ]),

    async execute(message: Message, args: string[]) {
        const [code, ...newDescriptionParts] = args;
        const newDescription = newDescriptionParts.join(' ');

        if (!code || !newDescription) {
            return message.reply('Uso: !task-text-update <código> <nova descrição>');
        }

        const updatedTodo = await todoService.updateTodoText(message.author.id, code, newDescription);

        if (!updatedTodo) {
            return message.reply('Tarefa não encontrada ou você não tem permissão para atualizá-la.');
        }

        message.reply(`Descrição da tarefa atualizada com sucesso! Nova descrição: ${updatedTodo.description}`);
    },
};
