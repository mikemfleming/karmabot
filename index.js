// TO-DO:
//  - deploy
//  - dynamically add fun messages
//  - see karma total
//  - limit to 5 per message?
//  - decrement karma?

const {DISCORD_BOT_TOKEN, MONGODB_CONN} = process.env;
const Discord = require('discord.js');
const client = new Discord.Client();

const mongoose = require('mongoose');
mongoose.connect(MONGODB_CONN, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected!');
});
const karmaSchema = new mongoose.Schema({
  guildId: Number,
  userId: Number,
  karma: Number,
});
const Karma = mongoose.model('Karma', karmaSchema);

const isGivingKarmaRegex = /<@\!\w*>\s\+*/g;

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  const {
    content,
    channel: {
      guild: {id: guildId},
    },
    mentions: {users: mentionedUsers},
  } = message;

  if (isGivingKarmaRegex.test(content) && mentionedUsers.size > 0) {
    const karmaToAdd = (content.match(/\+/g) || []).length;

    for ([userId, {username}] of mentionedUsers) {
      const updatedDocument = await Karma.findOneAndUpdate({
        guildId,
        userId,
      },
      {
        $inc: {karma: karmaToAdd},
      },
      {
        new: true,
        upsert: true,
        useFindAndModify: false,
      });

      message.channel.send(
          `**${username}** now has ${updatedDocument.karma} karma. Nice!`,
      );
    }
  }
});

client.login(DISCORD_BOT_TOKEN);
