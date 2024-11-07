// ./src/commands/task-delete-all.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotCommand = {
    name: 'task-delete-all',
    description: 'Deleta todas as tarefas do usuário.',
    allowedBy: new Set(['all']),

    async execute(message: Message) {
        try {
            await todoService.deleteAllTodos(message.author.id);
            message.reply('Todas as suas tarefas foram deletadas com sucesso.');
        } catch (error) {
            console.error('Erro ao deletar todas as tarefas:', error);
            message.reply('Ocorreu um erro ao tentar deletar suas tarefas. Tente novamente mais tarde.');
        }
    },
};
