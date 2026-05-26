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
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// ======================
// Slash Commands
// ======================

const commands = [

  // /announcement
  new SlashCommandBuilder()
    .setName('announcement')
    .setDescription('ประกาศ @everyone')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('ข้อความประกาศ')
        .setRequired(true)
    ),

  // /raid
  new SlashCommandBuilder()
    .setName('raid')
    .setDescription('Raid Alert + DM')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('เลือกยศ')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('ข้อความ')
        .setRequired(true)
    ),

  // /activecheck
  new SlashCommandBuilder()
    .setName('activecheck')
    .setDescription('Active Check')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('ข้อความ')
        .setRequired(true)
    )

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// ======================
// Bot Ready
// ======================

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

// ======================
// Commands
// ======================

client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  // ======================
  // /announcement
  // ======================

  if (interaction.commandName === 'announcement') {

    const msg = interaction.options.getString('message');

    await interaction.reply({
      content: `@everyone\n📢 Announcement\n\n${msg}`,
      allowedMentions: {
        parse: ['everyone']
      }
    });

  }

  // ======================
  // /raid
  // ======================

  if (interaction.commandName === 'raid') {

    const role = interaction.options.getRole('role');
    const msg = interaction.options.getString('message');

    // ส่งในห้อง
    await interaction.reply({
      content: `${role}\n🚨 RAID ALERT 🚨\n\n${msg}`,
      allowedMentions: {
        roles: [role.id]
      }
    });

    // DM ทุกคนในเซิร์ฟ
    const members = await interaction.guild.members.fetch();

    members.forEach(member => {

      if (!member.user.bot) {

        member.send(`🚨 RAID ALERT 🚨\n\n${msg}`)
        .catch(() => {});

      }

    });

  }

  // ======================
  // /activecheck
  // ======================

  if (interaction.commandName === 'activecheck') {

    const msg = interaction.options.getString('message');

    await interaction.reply({
      content: `@everyone\n✅ ACTIVE CHECK\n\n${msg}`,
      allowedMentions: {
        parse: ['everyone']
      }
    });

  }

});

client.login(process.env.TOKEN);
