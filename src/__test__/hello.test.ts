import { command as helloCommand } from '../commands/hello';
import { Message, GuildMember, Role, Collection } from 'discord.js';

describe('hello command', () => {
    const createMockMessage = (roles: string[]): Message => {
        const mockRoles = new Collection<string, Role>();
        roles.forEach(roleName => {
            mockRoles.set(roleName, { id: roleName, name: roleName } as Role);
        });

        const mockMember = {
            roles: {
                cache: mockRoles,
            },
        } as unknown as GuildMember;

        return {
            member: mockMember,
            reply: jest.fn(),
        } as unknown as Message;
    };

    it('should reply with "Hello!" if user has the "staff" role', async () => {
        const mockMessage = createMockMessage(['staff']);
        await helloCommand.execute(mockMessage, []);
        expect(mockMessage.reply).toHaveBeenCalledWith('Hello! Todo poderoso staff!');
    });

    it('should reply with error message if user has the "oreia-seca" role', async () => {
        const mockMessage = createMockMessage(['oreia-seca']);
        await helloCommand.execute(mockMessage, []);
        expect(mockMessage.reply).toHaveBeenCalledWith("Sai daí 'oreia-seca'! Você precisa ganhar algumas credenciais primeiro para falar comigo!");
    });

    it('should reply with permission error if user has no allowed role', async () => {
        const mockMessage = createMockMessage(['random-role']);
        await helloCommand.execute(mockMessage, []);
        expect(mockMessage.reply).toHaveBeenCalledWith('Você não possui permissão para usar este comando.');
    });
});
