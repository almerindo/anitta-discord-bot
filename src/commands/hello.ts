import { Message } from 'discord.js';
import { IBotCommand } from '../bot/IBotCommand';

export const command: IBotCommand = {
    name: 'hello',
    description: 'Verifica o cargo do usuário e responde de acordo.',
    allowedBy: new Set(['staff', 'oreia-seca']),

    async execute(message: Message, args: string[]) {
        if (!message.member) {
            return message.reply('Este comando só pode ser usado em um servidor.');
        }

        const roles = message.member.roles.cache;
        const allowedRoles = this.allowedBy || new Set(['all']);

        // Se `allowedBy` for "all", qualquer cargo pode executar
        if (allowedRoles.has('all') || roles.some(role => allowedRoles.has(role.name))) {
            if (roles.some(role => role.name === 'staff')) {
                message.reply('Hello! Todo poderoso staff!');
            } else if (roles.some(role => role.name === 'oreia-seca')) {
                message.reply(`Sai daí 'oreia-seca'! Você precisa ganhar algumas credenciais primeiro para falar comigo!`);
            }
        } else {
            message.reply('Você não possui permissão para usar este comando.');
        }
    },
};
