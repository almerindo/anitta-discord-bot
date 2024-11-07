// ./src/commands/task-delete.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotSlashCommand = {
    group: 'todo',
    name: 'task-delete',
    description: 'Deleta uma tarefa específica pelo código.',
    usage: `
**/task-delete** \`<código>\`
- Deleta uma tarefa pelo código.
- **Exemplo**: \`/task-delete T123\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        console.info(`Comando task-delete foi executado por ${interaction.user.tag}`);
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.options.get('code')?.value as string;

        if (!code) {
            await interaction.followUp({ content: `Uso correto do comando: ${command.usage}`, ephemeral: true });
            return;
        }

        const deletedTodo = await todoService.deleteTodo(interaction.user.id, code);
        if (deletedTodo) {
            await interaction.followUp({ content: `Tarefa deletada com sucesso! Código: ${deletedTodo.code}`, ephemeral: true });
        } else {
            await interaction.followUp({ content: `Tarefa não encontrada com o código ${code}.`, ephemeral: true });
        }
    },

    slashCommand: new SlashCommandBuilder()
        .setName('task-delete')
        .setDescription('Deleta uma tarefa específica pelo código')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Código da tarefa a ser deletada')
                .setRequired(true)
        ),
};
