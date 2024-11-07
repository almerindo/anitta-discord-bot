// ./src/commands/task.ts
import { CacheType, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../bot/botcommand.interface';
import { TodoService } from '../services/todo/todo.service';
import { randomMessage } from '../bot/messages';

const todoService = new TodoService();

const group = 'todo';
const name = 'task';
const description = 'Gerencia suas tarefas com várias operações como adicionar, visualizar, atualizar e deletar.';

export const command: IBotSlashCommand = {
    group,
    name,
    description,
    allowedBy: new Set(['staff', 'bug-catcher', 'oreia-seca']),
    usage: `
**/task** <ação> \`<opções>\`
- Realiza uma das várias ações de gerenciamento de tarefas, como adicionar, visualizar e atualizar tarefas.
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.deferReply({ ephemeral: true });

        const subcommand = (interaction.options as CommandInteractionOptionResolver).getSubcommand();
        const userId = interaction.user.id;
        const username = interaction.user.username;

        // Verifica as permissões para certos comandos
        const hasPermission = (roles: string[]) => {
            const memberRoles = interaction.member?.roles;
            if (!memberRoles || !('cache' in memberRoles)) return false;
            return roles.some(role => memberRoles.cache.some(r => r.name === role));
        };

        try {
            switch (subcommand) {
                case 'add':
                    // Adiciona uma tarefa, com opção de adicionar para outro usuário se permitido
                    const codeAdd = interaction.options.get('code', true).value as string;
                    const descriptionAdd = interaction.options.get('description', true).value as string;
                    const targetUserId = interaction.options.get('user')?.value as string;

                    // Se o usuário especifica outro usuário, verifica permissão
                    if (targetUserId && !hasPermission(['staff', 'bug-catcher'])) {
                        return interaction.followUp({
                            content: 'Você não tem permissão para adicionar uma tarefa para outro usuário.',
                            ephemeral: true,
                        });
                    }

                    // Define o usuário alvo e nome para a tarefa
                    const targetUser = targetUserId || userId;
                    const targetUsername = targetUserId
                        ? (await interaction.guild?.members.fetch(targetUserId))?.user.username || 'Usuário Desconhecido'
                        : username;

                    const todo = await todoService.addTodo(targetUser, targetUsername, codeAdd, descriptionAdd);
                    await interaction.followUp({
                        content: `Tarefa adicionada com sucesso para ${targetUsername}! Código: ${todo.code}, Descrição: ${todo.description}`,
                        ephemeral: true,
                    });

                    // Enviar mensagem privada ao usuário alvo se a tarefa foi adicionada por outro usuário
                    if (targetUserId && targetUserId !== userId) {
                        const targetUserMember = await interaction.guild?.members.fetch(targetUserId);
                        if (targetUserMember) {
                            await targetUserMember.user.send(
                                `Olá ${targetUserMember.user.username}, uma nova tarefa foi adicionada para você por ${interaction.user.username}: ` +
                                `\n**Código**: ${todo.code}\n**Descrição**: ${todo.description}`
                            ).catch(error => console.error('Erro ao enviar mensagem privada:', error));
                        }
                    }
                    break;

                case 'get':
                    const codeGet = interaction.options.get('code', true).value as string;
                    const task = await todoService.getTodoByCode(userId, codeGet);
                    if (!task) {
                        await interaction.followUp({ content: 'Tarefa não encontrada.', ephemeral: true });
                    } else {
                        await interaction.followUp({
                            content: `Tarefa: ${task.description} - Status: ${task.status}`,
                            ephemeral: true,
                        });
                    }
                    break;

                case 'text-update':
                    const codeTextUpdate = interaction.options.get('code', true).value as string;
                    const newDescription = interaction.options.get('description', true).value as string;
                    const updatedTodo = await todoService.updateTodoText(userId, codeTextUpdate, newDescription);
                    if (!updatedTodo) {
                        await interaction.followUp({ content: 'Tarefa não encontrada ou você não tem permissão para atualizá-la.', ephemeral: true });
                    } else {
                        await interaction.followUp({
                            content: `Descrição da tarefa atualizada com sucesso! Nova descrição: ${updatedTodo.description}`,
                            ephemeral: true,
                        });
                    }
                    break;

                case 'delete':
                    const codeDelete = interaction.options.get('code', true).value as string;
                    const deletedTodo = await todoService.deleteTodo(userId, codeDelete);
                    if (!deletedTodo) {
                        await interaction.followUp({ content: 'Tarefa não encontrada ou você não tem permissão para deletá-la.', ephemeral: true });
                    } else {
                        await interaction.followUp({ content: `Tarefa deletada com sucesso!`, ephemeral: true });
                    }
                    break;

                case 'delete-all':
                    await todoService.deleteAllTodos(userId);
                    await interaction.followUp({ content: 'Todas as suas tarefas foram deletadas com sucesso.', ephemeral: true });
                    break;

                case 'stats':
                    let statistics;
                    if (hasPermission(['staff'])) {
                        statistics = await todoService.getTaskStatistics();
                    } else if (hasPermission(['oreia-seca', 'bug-catcher'])) {
                        statistics = await todoService.getTaskStatistics(userId);
                    } else {
                        return interaction.followUp({ content: randomMessage(), ephemeral: true });
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
                    break;

                default:
                    await interaction.followUp({ content: 'Comando inválido.', ephemeral: true });
            }
        } catch (error) {
            console.error(`Erro ao executar o comando ${name}:`, error);
            await interaction.followUp({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true });
        }
    },

    slashCommand: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Adiciona uma nova tarefa')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Código único para a tarefa')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Descrição da tarefa')
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Usuário para quem a tarefa será adicionada')
                        .setRequired(false))) // Opcional, apenas para staff e bug-catcher
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Exibe os detalhes de uma tarefa')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Código da tarefa')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('text-update')
                .setDescription('Atualiza a descrição de uma tarefa')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Código da tarefa')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Nova descrição para a tarefa')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Deleta uma tarefa específica')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Código da tarefa')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete-all')
                .setDescription('Deleta todas as tarefas do usuário'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('Mostra estatísticas das tarefas por status')),
};
