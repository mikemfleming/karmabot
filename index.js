// TO-DO:
//  - dynamically add fun messages
//  - see karma total
//  - limit to 5 per message?
//  - decrement karma?

const {DISCORD_BOT_TOKEN} = process.env;
const Discord = require('discord.js');
const karma = require('./karma');
const client = new Discord.Client();

const isGivingKarmaRegex = /<@\!\w*>\s\+*/g;
// const isAddingMessageRegex = /^\!karma\s/g;

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

  // handle awarding of karma
  if (isGivingKarmaRegex.test(content) && mentionedUsers.size > 0) {
    const karmaToAdd = (content.match(/\+/g) || []).length;

    const updatedKarmas = await karma.awardKarma({
      karmaToAdd,
      mentionedUsers,
      guildId,
      message,
    });

    updatedKarmas.forEach(({username, updatedKarma}) => message.channel.send(
        `**${username}** now has ${updatedKarma} karma. Nice!`,
    ));
  }
});

client.login(DISCORD_BOT_TOKEN);
