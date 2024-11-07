// ./src/commands/task-add.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotCommand = {
    name: 'task-add',
    description: 'Adiciona uma nova tarefa à lista TODO do usuário.',
    allowedBy: new Set(['all']),

    async execute(message: Message, args: string[]) {
        const [code, ...descriptionParts] = args;
        const description = descriptionParts.join(' ');

        if (!code || !description) {
            return message.reply('Uso: !task-add <código> <descrição da tarefa>');
        }

        const todo = await todoService.addTodo(message.author.id, message.author.username, code, description);
        message.reply(`Tarefa adicionada com sucesso! Código: ${todo.code}, Descrição: ${todo.description}`);
    },
};
