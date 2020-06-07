// TO-DO:
//  - see karma total
//  - limit to 5 per message?
//  - decrement karma?

const {DISCORD_BOT_TOKEN} = process.env;
const Discord = require('discord.js');
const karma = require('./karma');
const quip = require('./quip');

const client = new Discord.Client();

const isGivingKarmaRegex = /<@\!\w*>\s\+*/g;
const isCreatingKarmaQuip = /^\!quip\s/g;

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

    const randomQuip = await quip.getRandomQuip(guildId);

    updatedKarmas.forEach(({username, updatedKarma}) => message.channel.send(
        `**${username}** now has ${updatedKarma} karma. ${randomQuip}`,
    ));

    return;
  }

  // handle adding of quips
  if (isCreatingKarmaQuip.test(content)) {
    const quipToCreate = content.replace(isCreatingKarmaQuip, '');

    await quip.createQuip(quipToCreate);

    return message.channel.send('Created a quip!');
  }
});

client.login(DISCORD_BOT_TOKEN);
