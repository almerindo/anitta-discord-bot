import { Client, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';

export function loadCommands(client: Client & { commands: Collection<string, any> }) {
    const commandDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
        const commandModule = require(`../commands/${file}`);
        const command = commandModule.command;

        // Verifique se o comando foi exportado corretamente e possui um nome
        if (!command || !command.name) {
            console.warn(`O arquivo ${file} não possui um comando válido.`);
            continue;
        }

        client.commands.set(command.name, command);
        console.info(`Command loaded: ${command.name}`);
    }
}
