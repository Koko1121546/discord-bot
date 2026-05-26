const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`ออนไลน์แล้ว ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.reply('pong!');
  }
});

client.login('MTUwODYzODIwOTQ2OTMyMTM5OA.GJwFg3.h3b9tiUijfrh_hS0TUYBGfKzuBobgzpbbPCnDo');
