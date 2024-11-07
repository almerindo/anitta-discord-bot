// ./src/commands/task-add-for-user.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

const group = 'todo';
const name = 'task-add-for-user';
const description = 'Adiciona uma tarefa para outro usuário especificado. (Apenas para staff e bug-catcher)';
const allowedBy = new Set(['staff', 'bug-catcher']);
// Função auxiliar para verificar permissões usando allowedBy
function hasAllowedRole(interaction: CommandInteraction, allowedRoles: Set<string>): boolean {
    const memberRoles = interaction.member?.roles as any;
    return memberRoles?.cache.some((role: any) => allowedRoles.has(role.name));
}

export const command: IBotSlashCommand = {
    group,
    name,
    description,
    allowedBy,
    usage: `
**/task-add-for-user** \`<@userId> <código> <descrição>\`
- (Apenas para staff e bug-catcher) Adiciona uma nova tarefa para o usuário especificado.
- **Exemplo**: \`/task-add-for-user @user123 T456 Revisar documento final\`
`,

    async execute(interaction: CommandInteraction<CacheType>) {
        // Verifica se o usuário possui uma das permissões necessárias
        if (!hasAllowedRole(interaction, allowedBy)) {
            await interaction.reply({
                content: 'Você não tem permissão para usar este comando.',
                ephemeral: true
            });
            return;
        }

        // Responder de forma efêmera para o usuário
        await interaction.deferReply({ ephemeral: true });

        const userMention = interaction.options.get('user')?.user;
        const code = interaction.options.get('code')?.value as string;
        const description = interaction.options.get('description')?.value as string;

        // Verificação de userMention
        if (!userMention) {
            await interaction.followUp({ content: 'Usuário não encontrado ou inválido.', ephemeral: true });
            return;
        }

        const userId = userMention.id;
        const username = userMention.username;

        if (!code || !description) {
            await interaction.followUp({ content: `Uso correto do comando: ${command.usage}`, ephemeral: true });
            return;
        }

        // Cria a tarefa para o usuário especificado
        const todo = await todoService.addTodo(userId, username, code, description);
        await interaction.followUp({
            content: `Tarefa adicionada com sucesso para ${username}! Código: ${todo.code}, Descrição: ${todo.description}`,
            ephemeral: true,
        });
    },

    slashCommand: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Usuário para quem a tarefa será adicionada')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Código único para identificar a tarefa')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Resumo do que a tarefa envolve')
                .setRequired(true)
        ),
};
