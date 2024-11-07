// ./src/commands/task-todo.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../bot/botcommand.interface';
import { TodoService } from '../services/todo/todo.service';
import { ETodoStatus } from '../services/todo/models/todo.model';

const todoService = new TodoService();

export const command: IBotSlashCommand = {
    group: 'todo',
    name: 'task',
    description: 'Gerencia tarefas TODO com diferentes ações (adicionar, listar, atualizar, deletar)',
    usage: `
**/todo** \`<ação> <opções>\`
- Executa diferentes operações em tarefas TODO, como adicionar, listar, atualizar ou deletar.
- **Exemplo**: \`/todo action:add code:T123 description:Revisar documentação\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
      const code = interaction.options.get('code')?.value as string;
      const description = interaction.options.get('description')?.value as string;

      const action = interaction.options.get('action')?.value as string;
      const status = interaction.options.get('status')?.value as string;


        switch (action) {
            case 'add':
                if (!code || !description) {
                    await interaction.reply({ content: `Uso correto do comando: /todo action:add code:<código> description:<descrição>`, ephemeral: true });
                    return;
                }
                const addedTodo = await todoService.addTodo(
                    interaction.user.id,
                    interaction.user.username,
                    code,
                    description
                );
                await interaction.reply({
                    content: `Tarefa adicionada com sucesso! Código: ${addedTodo.code}, Descrição: ${addedTodo.description}`,
                    ephemeral: true,
                });
                break;

            case 'list':
                const todos = await todoService.getTodos(interaction.user.id);
                const todoList = todos.map(todo => `Código: ${todo.code}, Descrição: ${todo.description}`).join('\n') || 'Nenhuma tarefa encontrada.';
                await interaction.reply({ content: `Suas tarefas:\n${todoList}`, ephemeral: true });
                break;

            case 'update-status':
                if (!code || !status) {
                    await interaction.reply({ content: `Uso correto do comando: /todo action:update-status code:<código> status:<todo|doing|done>`, ephemeral: true });
                    return;
                }
                const updatedStatus = await todoService.updateTodoStatus(interaction.user.id, code, status as ETodoStatus);
                if (updatedStatus) {
                    await interaction.reply({
                        content: `Status da tarefa atualizado! Código: ${updatedStatus.code}, Novo Status: ${updatedStatus.status}`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({ content: `Tarefa não encontrada com o código ${code}.`, ephemeral: true });
                }
                break;

            case 'update-text':
                if (!code || !description) {
                    await interaction.reply({ content: `Uso correto do comando: /todo action:update-text code:<código> description:<nova descrição>`, ephemeral: true });
                    return;
                }
                const updatedText = await todoService.updateTodoText(interaction.user.id, code, description);
                if (updatedText) {
                    await interaction.reply({
                        content: `Descrição da tarefa atualizada! Código: ${updatedText.code}, Nova Descrição: ${updatedText.description}`,
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({ content: `Tarefa não encontrada com o código ${code}.`, ephemeral: true });
                }
                break;

            case 'delete':
                if (!code) {
                    await interaction.reply({ content: `Uso correto do comando: /todo action:delete code:<código>`, ephemeral: true });
                    return;
                }
                const deletedTodo = await todoService.deleteTodo(interaction.user.id, code);
                if (deletedTodo) {
                    await interaction.reply({ content: `Tarefa deletada com sucesso! Código: ${deletedTodo.code}`, ephemeral: true });
                } else {
                    await interaction.reply({ content: `Tarefa não encontrada com o código ${code}.`, ephemeral: true });
                }
                break;

            case 'delete-all':
                await todoService.deleteAllTodos(interaction.user.id);
                await interaction.reply({ content: 'Todas as suas tarefas foram deletadas.', ephemeral: true });
                break;

            default:
                await interaction.reply({ content: 'Ação inválida. Use "add", "list", "update-status", "update-text", "delete", ou "delete-all".', ephemeral: true });
        }
    },

    slashCommand: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('Gerencia tarefas TODO com diferentes ações')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Ação a realizar: add, list, update-status, update-text, delete, delete-all')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'list', value: 'list' },
                    { name: 'update-status', value: 'update-status' },
                    { name: 'update-text', value: 'update-text' },
                    { name: 'delete', value: 'delete' },
                    { name: 'delete-all', value: 'delete-all' }
                )
        )
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Código único para identificar a tarefa')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Resumo do que a tarefa envolve ou nova descrição')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Novo status da tarefa (todo, doing, done)')
                .setRequired(false)
                .addChoices(
                    { name: 'todo', value: ETodoStatus.TODO },
                    { name: 'doing', value: ETodoStatus.DOING },
                    { name: 'done', value: ETodoStatus.DONE }
                )
        ),
};
