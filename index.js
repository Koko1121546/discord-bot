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
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

const commands = [

  // /announcement
  new SlashCommandBuilder()
    .setName('announcement')
    .setDescription('ประกาศ @everyone')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('ข้อความ')
        .setRequired(true)
    ),

  // /raid
  new SlashCommandBuilder()
    .setName('raid')
    .setDescription('Raid Alert')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('เลือกยศ')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('ข้อความ')
        .setRequired(true)
    ),

  // /activecheck
  new SlashCommandBuilder()
    .setName('activecheck')
    .setDescription('เช็คคน Active')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('ข้อความ')
        .setRequired(true)
    )

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async () => {

  console.log(`ออนไลน์แล้ว ${client.user.tag}`);

  try {

    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log('Slash Commands พร้อมแล้ว');

  } catch (error) {
    console.error(error);
  }

});

client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  // =========================
  // /announcement
  // =========================
  if (interaction.commandName === 'announcement') {

    const msg = interaction.options.getString('message');

    await interaction.reply({
      content: `@everyone\n📢 ${msg}`
    });
  }

  // =========================
  // /raid
  // =========================
  if (interaction.commandName === 'raid') {

    const role = interaction.options.getRole('role');
    const msg = interaction.options.getString('message');

    await interaction.reply({
      content: `${role}\n🚨 RAID ALERT 🚨\n${msg}`
    });

    // DM ทุกคน
    interaction.guild.members.fetch().then(members => {

      members.forEach(member => {

        if (!member.user.bot) {

          member.send(`🚨 RAID ALERT 🚨\n${msg}`)
          .catch(() => {});
        }

      });

    });

  }

  // =========================
  // /activecheck
  // =========================
  if (interaction.commandName === 'activecheck') {

    const msg = interaction.options.getString('message');

    await interaction.reply({
      content: `@everyone\n✅ ACTIVE CHECK\n${msg}`
    });
  }

});

client.login(process.env.TOKEN);
