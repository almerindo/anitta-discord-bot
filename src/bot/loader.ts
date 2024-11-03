import { Client, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';

export function loadCommands(client: Client & { commands: Collection<string, any> }) {
    const commandDir = path.join(__dirname, '../command');
    const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../command/${file}`);
        client.commands.set(command.command.name, command.command);
    }
}
