import { Message } from 'discord.js';
import { IBotCommand } from './IBotCommand';

export function hasPermission(command: IBotCommand, message: Message): boolean {
    // Verifica se o comando permite todos os cargos
    const allowedRoles = command.allowedBy || new Set(['all']);

    // Verifica se `allowedBy` contém "all" ou se o usuário tem algum dos cargos permitidos
    if (allowedRoles.has('all')) {
        return true;
    }

    // Verifica se o autor da mensagem possui algum dos cargos permitidos
    const userRoles = message.member?.roles.cache;
    return userRoles ? userRoles.some(role => allowedRoles.has(role.name)) : false;
}
