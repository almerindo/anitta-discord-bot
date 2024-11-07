// ./src/commands/task-help.ts
import { Message } from 'discord.js';
import { IBotCommand } from '../../bot/botcommand.interface';

export const command: IBotCommand = {
    name: 'task-help',
    description: 'Exibe a sintaxe de todos os comandos de tarefas.',
    allowedBy: new Set(['all']),

    async execute(message: Message) {
        const helpMessage = `
**Lista de Comandos de Tarefas**

1. **!task-add** <código> <descrição>
   - Adiciona uma nova tarefa.
   - Exemplo: \`!task-add T123 Revisar documentação\`

2. **!task-list**
   - Lista todas as tarefas do usuário.
   - Exemplo: \`!task-list\`

3. **!task-status-update** <código> <todo|doing|done>
   - Atualiza o status de uma tarefa específica.
   - Exemplo: \`!task-status-update T123 done\`

4. **!task-text-update** <código> <nova descrição>
   - Atualiza o texto (descrição) de uma tarefa específica.
   - Exemplo: \`!task-text-update T123 Nova descrição para a tarefa\`

5. **!task-delete** <código>
   - Deleta uma tarefa pelo código.
   - Exemplo: \`!task-delete T123\`

6. **!task-delete-all**
   - Deleta todas as tarefas do usuário.
   - Exemplo: \`!task-delete-all\`

7. **!task-get** <código>
   - Mostra os detalhes de uma tarefa específica pelo código.
   - Exemplo: \`!task-get T123\`

8. **!task-stats**
   - Mostra estatísticas das tarefas por usuário, agrupadas por status.
   - Exemplo: \`!task-stats\`

9. **!task-add-for-user** <@userId> <código> <descrição>
   - (Apenas para staff e bug-catcher) Adiciona uma nova tarefa para o usuário especificado.
   - Exemplo: \`!task-add-for-user @user123 T456 Revisar documento final\`

10. **!task-help**
   - Exibe a sintaxe de todos os comandos de tarefas.
   - Exemplo: \`!task-help\`
`;

        message.reply(helpMessage);
    },
};
