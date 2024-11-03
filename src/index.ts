import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { loadCommands } from './bot/loader';
import dotenv from 'dotenv';

dotenv.config();

interface ExtendedClient extends Client {
    commands: Collection<string, any>;
}

const client: ExtendedClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
}) as ExtendedClient;

client.commands = new Collection(); // Inicialize a coleção de comandos

client.once('ready', () => {
    console.log(`Bot is ready as ${client.user?.tag}!`);
});

// Carregar comandos dinamicamente
loadCommands(client);

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase() as string;

    const command = client.commands.get(commandName);
    if (command) {
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Ocorreu um erro ao executar o comando.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
