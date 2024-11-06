import { Message } from 'discord.js';
import {command} from '../commands/ping';

describe('Comando ping', () => {
    it('responde com Pong!', async () => {
        const mockMessage = { reply: jest.fn() } as unknown as Message;
        await command.execute(mockMessage, []);
        expect(mockMessage.reply).toHaveBeenCalledWith('Pong!');
    });
});
