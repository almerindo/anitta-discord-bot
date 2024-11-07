// ./src/commands/task-stats.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';
import { randomMessage } from '../../bot/messages';

const todoService = new TodoService();

const group = 'todo';
const name = 'task-stats';
const description = 'Mostra estatísticas das tarefas por usuário, agrupadas por status.';

export const command: IBotSlashCommand = {
    group,
    name,
    description,
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca']), // Define as roles permitidas
    usage: `
**/task-stats**
- Mostra estatísticas das tarefas agrupadas por status.
- **Exemplo**: \`/task-stats\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        // Responder de forma efêmera
        await interaction.deferReply({ ephemeral: true });

        let statistics;

        // Verificação de roles com acesso ao cache de roles da guilda
        const memberRoles = interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache;
        if (memberRoles?.some(role => role.name === 'staff')) {
            // Se for staff, exibe estatísticas de todos os usuários
            statistics = await todoService.getTaskStatistics();
        } else if (memberRoles?.some(role => ['oreia-seca', 'bug-catcher'].includes(role.name))) {
            // Se for oreia-seca ou bug-catcher, exibe apenas estatísticas do autor
            statistics = await todoService.getTaskStatistics(interaction.user.id);
        } else {
            // Para outros cargos, exibe uma mensagem sarcástica
            await interaction.followUp({ content: randomMessage(), ephemeral: true });
            return;
        }

        if (!statistics || statistics.length === 0) {
            await interaction.followUp({ content: 'Não há tarefas registradas.', ephemeral: true });
            return;
        }

        let response = 'Estatísticas das tarefas:\n';
        for (const stat of statistics) {
            response += `Usuário: ${stat._id}\n`;
            for (const status of stat.statusCounts) {
                response += `  ${status.status}: ${status.count}\n`;
            }
        }

        await interaction.followUp({ content: response, ephemeral: true });
    },

    slashCommand: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
};
