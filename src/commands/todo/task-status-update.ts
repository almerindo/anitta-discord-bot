// ./src/commands/task-update-status.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';
import { ETodoStatus } from '../../services/todo/models/todo.model';

const todoService = new TodoService();

export const command: IBotSlashCommand = {
    group: 'todo',
    name: 'task-update-status',
    description: 'Atualiza o status de uma tarefa específica.',
    usage: `
**/task-update-status** \`<código> <status>\`
- Atualiza o status de uma tarefa.
- **Exemplo**: \`/task-update-status T123 done\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        console.info(`Comando task-update-status foi executado por ${interaction.user.tag}`);
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.options.get('code')?.value as string;
        const status = interaction.options.get('status')?.value as ETodoStatus;

        if (!code || !status) {
            await interaction.followUp({ content: `Uso correto do comando: ${command.usage}`, ephemeral: true });
            return;
        }

        const updatedTodo = await todoService.updateTodoStatus(interaction.user.id, code, status);
        if (updatedTodo) {
            await interaction.followUp({
                content: `Status da tarefa atualizado com sucesso! Código: ${updatedTodo.code}, Novo Status: ${updatedTodo.status}`,
                ephemeral: true,
            });
        } else {
            await interaction.followUp({ content: `Tarefa não encontrada com o código ${code}.`, ephemeral: true });
        }
    },

    slashCommand: new SlashCommandBuilder()
        .setName('task-update-status')
        .setDescription('Atualiza o status de uma tarefa específica')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Código da tarefa a ser atualizada')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Novo status da tarefa')
                .setRequired(true)
                .addChoices(
                    { name: 'todo', value: ETodoStatus.TODO },
                    { name: 'doing', value: ETodoStatus.DOING },
                    { name: 'done', value: ETodoStatus.DONE }
                )
        ),
};
