// ./src/commands/task-stats.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';
import { randomMessage } from '../../bot/messages';

const todoService = new TodoService();

export const command: IBotCommand = {
    group: 'todo',
    name: 'task-stats',
    description: 'Mostra estatísticas das tarefas por usuário, agrupadas por status.',
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca']),
    usage: `
**!task-stats**
- Mostra estatísticas das tarefas agrupadas por status.
- **Exemplo**: \`!task-stats\`
`,

    async execute(message: Message) {
        let statistics;

        if (message.member?.roles.cache.some(role => role.name === 'staff')) {
            // Se for staff, exibe estatísticas de todos os usuários
            statistics = await todoService.getTaskStatistics();
        } else if (message.member?.roles.cache.some(role => ['oreia-seca', 'bug-catcher'].includes(role.name))) {
            // Se for oreia-seca ou bug-catcher, exibe apenas estatísticas do autor
            statistics = await todoService.getTaskStatistics(message.author.id);
        } else {
            // Para outros cargos, exibe uma mensagem sarcástica
            return message.reply(randomMessage());
        }

        if (statistics.length === 0) {
            return message.reply('Não há tarefas registradas.');
        }

        let response = 'Estatísticas das tarefas:\n';
        for (const stat of statistics) {
            response += `Usuário: ${stat._id}\n`;
            for (const status of stat.statusCounts) {
                response += `  ${status.status}: ${status.count}\n`;
            }
        }

        message.reply(response);
    },
};
