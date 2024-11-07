// ./src/commands/task-add-for-user.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotCommand = {
    name: 'task-add-for-user',
    description: 'Adiciona uma tarefa para outro usuário especificado.',
    allowedBy: new Set(['staff', 'bug-catcher']), // Apenas staff e bug-catcher podem executar

    async execute(message: Message, args: string[]) {
        // Validação de permissões
        if (!message.member?.roles.cache.some(role => ['staff', 'bug-catcher'].includes(role.name))) {
            return message.reply('Você não tem permissão para usar este comando.');
        }

        const [userIdMention, code, ...descriptionParts] = args;
        const description = descriptionParts.join(' ');

        // Verificação de formato de menção para userId
        if (!userIdMention || !userIdMention.startsWith('<@') || !userIdMention.endsWith('>')) {
            return message.reply('Você precisa digitar @username como userId.');
        }

        const userId = userIdMention.slice(2, -1); // Extrai o userId removendo "<@" e ">"

        if (!code || !description) {
            return message.reply('Uso: !task-add-for-user <@userId> <código> <descrição>');
        }

        // Pega o nome de usuário usando o userId
        const targetUser = await message.guild?.members.fetch(userId);
        const username = targetUser?.user.username;

        if (!username) {
            return message.reply('Usuário não encontrado.');
        }

        // Cria a tarefa para o usuário especificado
        const todo = await todoService.addTodo(userId, username, code, description);
        message.reply(`Tarefa adicionada com sucesso para ${username}! Código: ${todo.code}, Descrição: ${todo.description}`);
    },
};
