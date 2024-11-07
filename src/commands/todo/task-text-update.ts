// ./src/commands/task-text-update.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

const group = 'todo';
const name = 'task-text-update';
const description = 'Atualiza o texto (descrição) de uma tarefa específica pelo código.';

export const command: IBotSlashCommand = {
    group,
    name,
    description,
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca']), // Define as roles permitidas
    usage: `
**/task-text-update** \`<código> <nova descrição>\`
- Atualiza o texto (descrição) de uma tarefa específica.
- **Exemplo**: \`/task-text-update T123 Corrigir erros de digitação\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        const code = interaction.options.get('code')?.value as string;
        const newDescription = interaction.options.get('description')?.value as string;

        // Verifica se todos os argumentos foram fornecidos
        if (!code || !newDescription) {
            await interaction.reply({ content: `Uso correto do comando: ${command.usage}`, ephemeral: true });
            return;
        }

        // Responder de forma efêmera
        await interaction.deferReply({ ephemeral: true });

        const updatedTodo = await todoService.updateTodoText(interaction.user.id, code, newDescription);

        if (!updatedTodo) {
            await interaction.followUp({
                content: 'Tarefa não encontrada ou você não tem permissão para atualizá-la.',
                ephemeral: true,
            });
        } else {
            await interaction.followUp({
                content: `Descrição da tarefa atualizada com sucesso! Nova descrição: ${updatedTodo.description}`,
                ephemeral: true,
            });
        }
    },

    slashCommand: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Código da tarefa a ser atualizada')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Nova descrição para a tarefa')
                .setRequired(true)
        ),
};
