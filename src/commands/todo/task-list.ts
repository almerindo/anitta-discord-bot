// ./src/commands/task-list.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotCommand = {
    name: 'task-list',
    description: 'Lista todas as tarefas do usuário.',
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca', ]),

    async execute(message: Message) {
      console.info(message.author);

        const todos = await todoService.getTodos(message.author.id);

        if (todos.length === 0) {
            return message.reply('Você não tem tarefas pendentes.');
        }

        const todoList = todos
            .map(todo => `${todo.code} - ${todo.description} [${todo.status}]`)
            .join('\n');

        message.reply(`Suas tarefas:\n${todoList}`);
    },
};
