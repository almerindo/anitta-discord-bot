// ./src/commands/task-get.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

const group = 'todo';
const name = 'task-get';
const description = 'Mostra os detalhes de uma tarefa específica pelo código.';

export const command: IBotSlashCommand = {
    group,
    name,
    description,
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca']), // Define as roles permitidas
    usage: `
**/task-get** \`<código>\`
- Exibe os detalhes de uma tarefa específica pelo código.
- **Exemplo**: \`/task-get T123\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        const code = interaction.options.get('code')?.value as string;

        if (!code) {
            await interaction.reply({ content: `Uso correto do comando: ${command.usage}`, ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true }); // Resposta efêmera para o usuário

        const todo = await todoService.getTodoByCode(interaction.user.id, code);

        if (!todo) {
            await interaction.followUp({ content: 'Tarefa não encontrada.', ephemeral: true });
        } else {
            await interaction.followUp({
                content: `Tarefa: ${todo.description} - Status: ${todo.status}`,
                ephemeral: true,
            });
        }
    },

    slashCommand: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Código da tarefa a ser exibida')
                .setRequired(true)
        ),
};
