// ./src/bot/loader.ts
import { Client, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';

async function loadCommandsFromDirectory(dir: string, client: Client & { commands: Collection<string, any> }, baseDir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // Recursivamente carrega comandos de subdiretórios
            await loadCommandsFromDirectory(fullPath, client, baseDir);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/'); // Preserva o path relativo

            try {
                const commandModule = await import(`../commands/${relativePath}`);
                const command = commandModule.command;

                // Verifica se o comando possui um nome
                if (!command || !command.name) {
                    console.warn(`O arquivo ${relativePath} não possui um comando válido.`);
                    continue;
                }

                client.commands.set(command.name, command);
                console.info(`Command loaded: ${command.name} from ${relativePath}`);
            } catch (error) {
                console.error(`Erro ao carregar o comando em ${relativePath}:`, error);
            }
        }
    }
}

export async function loadCommands(client: Client & { commands: Collection<string, any> }) {
    const commandDir = path.join(__dirname, '../commands');
    await loadCommandsFromDirectory(commandDir, client, commandDir);
}
