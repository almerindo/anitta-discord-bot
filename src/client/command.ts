import { Client, Message } from 'discord.js';
import config from "../../config.json"

export interface IJsonCommand {
  command: string;
  dest?: string;
  cite?: string;
  msg: string;
}

export function isDirectMessage(message: Message): boolean {
  return message.channel.type === "dm";
}

export function extractCommand(content: string): IJsonCommand {
  let jsonCommand = null;
  try {
    jsonCommand = JSON.parse(content);
  } catch (error) {
    console.error({ error: error.message })
  }
  return jsonCommand;
}


export function proccessCommand(message: Message) {

  let command = extractCommand(message.content)
  executeCommand(command, message)

}

function executeCommand(commandJSON: IJsonCommand, message: Message) {
  try {
    console.info({conmando: commandJSON.command})

    switch (commandJSON.command) {
      case "setup":
        {
          message.reply(`O ID do Canal é: ${message.channel.id}`)
        }
        break;
      case "send":
        {
          let dest = commandJSON.dest ? commandJSON.dest : config.CHANNEL_IDS[0];
          const channel = message.client.channels.get(dest);
          let msg = '';
          if (commandJSON.cite) {
            msg = `<@${commandJSON.cite}> ` + commandJSON.msg
          } else {
            msg = commandJSON.msg
          }
          (channel as any).send(msg);
          message.reply(`Msg enviada para ${dest}`)
        }
        break;
      default:
        message.reply(`Comando tem que ter o formato: {"command":"send" "msg": "Minha mensagem" }`)
        break;
    }
    
  } catch (error) {
    console.error(error.message)
    message.reply(`Comando tem que ter o formato: {"command":"send" "msg": "Minha mensagem" }`)

  }
  // console.info(command)
  // console.info(message.channel.id)
  // console.info(message.channel.type)

  // // console.info(message.channel.lastMessage);
  // console.info(message.channel.lastMessageID);
}
