// ./src/commands/task-delete-all.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

const group = 'todo';
const name = 'task-delete-all';
const description = 'Deleta todas as tarefas do usuário.';

export const command: IBotSlashCommand = {
    group,
    name,
    description,
    usage: `
**/task-delete-all**
- Apaga todas as tarefas associadas ao usuário.
- **Exemplo**: \`/task-delete-all\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        console.info(`Comando ${name} foi executado por ${interaction.user.tag}`);

        // Responder de forma efêmera para o usuário
        await interaction.deferReply({ ephemeral: true });

        try {
            await todoService.deleteAllTodos(interaction.user.id);
            await interaction.followUp({ content: 'Todas as suas tarefas foram deletadas com sucesso.', ephemeral: true });
        } catch (error) {
            console.error('Erro ao deletar todas as tarefas:', error);
            await interaction.followUp({ content: 'Ocorreu um erro ao tentar deletar suas tarefas. Tente novamente mais tarde.', ephemeral: true });
        }
    },

    slashCommand: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
};
