import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { loadCommands } from './bot/loader';
import dotenv from 'dotenv';

dotenv.config();

interface ExtendedClient extends Client {
    commands: Collection<string, any>;
}

const client: ExtendedClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Adiciona a intenção para acessar o conteúdo das mensagens
    ],
}) as ExtendedClient;

client.commands = new Collection(); // Inicialize a coleção de comandos

client.once('ready', () => {
    console.log(`Bot is ready as ${client.user?.tag}!`);
});

// Defina o prefixo para os comandos
const prefix = '!';

// Carregar comandos dinamicamente
loadCommands(client);

client.on('messageCreate', async (message) => {
    console.info(`Message: ${message.content}`); // Mostra o conteúdo da mensagem

    if (message.author.bot) return;

    // Verifique se a mensagem começa com o prefixo
    if (!message.content.startsWith(prefix)) return;

    // Remova o prefixo e separe o comando e os argumentos
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase() as string;

    console.info(`Command: ${commandName}`);
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
