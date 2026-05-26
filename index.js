const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

const commands = [

  new SlashCommandBuilder()
    .setName('announcement')
    .setDescription('ส่งประกาศ')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('ข้อความประกาศ')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('raid')
    .setDescription('แจ้งเตือน Raid')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('ข้อความ')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('activecheck')
    .setDescription('เช็คคน Active')

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async () => {
  console.log(`ออนไลน์แล้ว ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log('ลงทะเบียน Slash Commands แล้ว');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  // /announcement
  if (interaction.commandName === 'announcement') {

    const msg = interaction.options.getString('message');

    await interaction.reply({
      content: `📢 Announcement\n\n${msg}`
    });
  }

  // /raid
  if (interaction.commandName === 'raid') {

    const msg = interaction.options.getString('message');

    await interaction.reply({
      content: `🚨 RAID ALERT 🚨\n\n${msg}`
    });
  }

  // /activecheck
  if (interaction.commandName === 'activecheck') {

    await interaction.reply({
      content: '✅ Active Check!'
    });
  }

});

client.login(process.env.TOKEN);
