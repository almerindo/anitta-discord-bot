import  { Client, Message } from 'discord.js';
import { isDirectMessage, proccessCommand } from '../client/command';
import config from "../../config.json"

const client = new Client();


client.on('ready', () => {
    const clientTag = client.user?.tag; 
    console.log(`Logged in as ${clientTag}!`);
  });
  

client.on("message", (message: Message) =>  {
  if (!message.author.bot) {
    if (isDirectMessage(message)) {
      proccessCommand(message)
    }
  }
});


export function startBot () {
    client.login(config.BOT_TOKEN);
}