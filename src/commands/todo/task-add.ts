// ./src/commands/task-add.ts
import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IBotSlashCommand } from '../../bot/botcommand.interface';
import { TodoService } from '../../services/todo/todo.service';

const todoService = new TodoService();

const group = 'todo';
const name = 'task-add';
const description = 'Adiciona uma nova tarefa com um código e uma descrição sobre o que precisa ser feito.';
const usage = `
**/task-add** \`<código> <descrição>\`
- Adiciona uma nova tarefa à sua lista.
- **Exemplo**: \`/task-add T123 Revisar documentação\`
`;

export const command: IBotSlashCommand = {
    group,
    name,
    description,
    usage,

    async execute(interaction: CommandInteraction<CacheType>) {

        console.info(`Comando ${name} foi executado por ${interaction.user.tag}`);
        // Responder rapidamente para evitar timeout
        await interaction.deferReply({ ephemeral: true });

        // Utilizando `get` e acessando as propriedades de retorno
        const code = interaction.options.get('code')?.value as string;
        const description = interaction.options.get('description')?.value as string;

        if (!code || !description) {
            await interaction.followUp({ content: `Uso correto do comando: ${command.usage}`, ephemeral: true });
            return;
        }

        const todo = await todoService.addTodo(interaction.user.id, interaction.user.username, code, description);
        await interaction.followUp({
            content: `Tarefa adicionada com sucesso! Código: ${todo.code}, Descrição: ${todo.description}`,
            ephemeral: true,
        });
    },

    slashCommand: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
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
