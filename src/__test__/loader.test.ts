import { Client, Collection } from 'discord.js';
import { loadCommands } from '../../src/bot/loader';

describe('Command Loader', () => {
    it('should load commands into the client', () => {
        const client = {
            commands: new Collection(),
        } as unknown as Client & { commands: Collection<string, any> };

        loadCommands(client);

        // Verifica se os comandos foram carregados
        expect(client.commands.has('ping')).toBe(true);
        expect(client.commands.has('hello')).toBe(true);

        // Verifica o número de comandos carregados
        expect(client.commands.size).toBeGreaterThan(0);
    });
});
