// ./src/commands/task-list.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

export const command: IBotSlashCommand = {
    group: 'todo',
    name: 'task-list',
    description: 'Lista todas as suas tarefas TODO.',
    usage: `
**/task-list**
- Lista todas as tarefas associadas à sua conta.
- **Exemplo**: \`/task-list\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        console.info(`Comando task-list foi executado por ${interaction.user.tag}`);
        await interaction.deferReply({ ephemeral: true });

        const todos = await todoService.getTodos(interaction.user.id);
        const todoList = todos.map(todo => `Código: ${todo.code}, Descrição: ${todo.description}, Status: ${todo.status}`).join('\n') || 'Nenhuma tarefa encontrada.';

        await interaction.followUp({ content: `Suas tarefas:\n${todoList}`, ephemeral: true });
    },

    slashCommand: new SlashCommandBuilder()
        .setName('task-list')
        .setDescription('Lista todas as suas tarefas TODO'),
};
