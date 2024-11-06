
# Discord Bot Boilerplate

This is a boilerplate for creating Discord bots in Node.js with TypeScript. It provides a basic structure to add and configure custom commands, set user permissions based on specific roles, and perform unit testing with Jest. This boilerplate is ideal for developers looking to quickly set up a Discord bot project with pre-built features and best practices.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Creating the Bot in Discord](#creating-the-bot-in-discord)
4. [Token and Environment Variable Configuration](#token-and-environment-variable-configuration)
5. [Running the Bot](#running-the-bot)
6. [Creating New Commands](#creating-new-commands)
7. [Permission Verification](#permission-verification)
8. [Testing](#testing)

## Prerequisites

- Node.js and Yarn installed.
- Discord account to create a bot.

## Initial Setup

Clone the repository and install dependencies:

```bash
git clone <REPOSITORY_URL>
cd discord-bot
yarn install
```

## Creating the Bot in Discord

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and log in with your Discord account.
2. Click on **New Application** and give your bot a name. Click **Create** to confirm.
3. In the left menu, select **Bot**, then **Add Bot**. Confirm the creation of the bot.
4. In the **TOKEN** field, click **Reset Token** and copy the token. **This token will be required to configure the bot**.
5. Go to **OAuth2 > URL Generator**:
   - In **OAuth2 Scopes**, select `bot`.
   - In **Bot Permissions**, select the necessary permissions:
     - **Read Messages/View Channels**: Allows the bot to read messages and view channels where it’s mentioned.
     - **Send Messages**: Allows the bot to send responses and messages.
     - **Manage Messages** *(optional)*: Required if the bot needs to manage or delete messages.
     - **Read Message History**: Allows the bot to read channel history.
     - **Use Slash Commands** *(optional)*: Required for using slash commands, such as `/ping`.
6. Copy the generated URL, replacing `YOUR_CLIENT_ID` with your bot’s ID and `PERMISSION_INTEGER` with the generated integer value. The URL should look like this:

   ```plaintext
   https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=PERMISSION_INTEGER
   ```

7. Use this URL in your browser to invite the bot to your Discord server.

## Token and Environment Variable Configuration

1. Create a `.env` file at the project root and add your bot token:

   ```plaintext
   DISCORD_TOKEN=YOUR_TOKEN
   ```

2. Ensure that `.env` is listed in `.gitignore` to prevent accidental token exposure.

## Running the Bot

To run the bot in development mode:

```bash
yarn dev
```

To compile TypeScript and run the bot in production:

```bash
yarn build
node dist/index.js
```

## Creating New Commands

1. Add a new file in the `src/command` folder with the command’s name (e.g., `hello.ts`).
2. Use the following structure in your new command file:

   ```typescript
   import { Message } from 'discord.js';
   import { BotCommand } from './BotCommand';

   export const command: BotCommand = {
       name: 'hello',
       description: 'An example command that says Hello!',
       allowedBy: new Set(['all']), // Defines allowed roles (or 'all' to allow everyone)

       async execute(message: Message, args: string[]) {
           await message.reply('Hello!');
       },
   };
   ```

3. **Command Fields**:
   - `name`: The name of the command, used to call it on Discord.
   - `description`: A short description of the command.
   - `allowedBy`: A set of roles allowed to run the command. Use `new Set(['all'])` to allow everyone.
   - `execute`: Function that defines the command’s logic.

## Permission Verification

Permission verification is implemented in `permissions.ts`. Each command can have a set of allowed roles specified through the `allowedBy` field. The verification logic works as follows:

- If `allowedBy` contains `all`, any role can execute the command.
- If `allowedBy` specifies certain roles, only users with one of these roles can execute the command.

The `hasPermission` function checks if the user has one of the allowed roles before executing the command.

Example usage in `hello.ts`:

```typescript
allowedBy: new Set(['staff', 'moderator']), // Only users with the 'staff' and 'moderator' roles can run this command
```

If a user tries to run a command without the necessary roles, the bot responds with a permission error message.

## Testing

The project uses Jest for unit testing of commands and permission logic.

### Running the Tests

To run all tests:

```bash
yarn test
```

Command tests check:
- Whether commands respond correctly based on the user's role.
- If the command loader works correctly.

### Example Command Test Structure

An example test for the `ping` command in `__tests__/commands/ping.test.ts`:

```typescript
import { command as pingCommand } from '../../src/command/ping';
import { Message } from 'discord.js';

describe('ping command', () => {
    it('should reply with "Pong!"', async () => {
        const mockMessage = { reply: jest.fn() } as unknown as Message;
        await pingCommand.execute(mockMessage, []);
        expect(mockMessage.reply).toHaveBeenCalledWith('Pong!');
    });
});
```

### Permission Verification Test Structure

To test permission verification, use role mocks to simulate different permissions.



# The used technologies
- Nodejs
- Typescript
- eslint
- prettier
- jest
- semantic-release
- npm
