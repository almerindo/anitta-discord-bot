import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { loadCommands } from './bot/loader';
import { hasPermission } from './bot/permissions';
import dotenv from 'dotenv';
import { IBotCommand } from './bot/botcommand.interface';
import mongoose from 'mongoose';

dotenv.config();


const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('MONGO_URI não está definido no arquivo .env');
    process.exit(1); // Encerra o processo se a URI não estiver configurada
}

mongoose.connect(mongoUri)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1); // Encerra o processo em caso de falha na conexão
    });

interface ExtendedClient extends Client {
    commands: Collection<string, any>;
}

const client: ExtendedClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
}) as ExtendedClient;

client.commands = new Collection();

client.once('ready', () => {
    console.log(`Bot is ready as ${client.user?.tag}!`);
});

// Defina o prefixo para os comandos
const prefix = '!';

// Carregar comandos dinamicamente
loadCommands(client);

client.on('messageCreate', async (message) => {
    console.info(`Message: ${message.content}`);

    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase() as string;

    console.info(`Command: ${commandName}`);
    const command = client.commands.get(commandName) as IBotCommand;

    if (command) {
        if (hasPermission(command, message)) {
            try {
                await command.execute(message, args);
            } catch (error) {
                console.error(error);
                message.reply('Ocorreu um erro ao executar o comando.');
            }
        } else {
            message.reply('Você não possui permissão para usar este comando.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
