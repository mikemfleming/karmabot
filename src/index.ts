// TO-DO:
//  - see karma total
//  - limit to 5 per message?
//  - decrement karma?

const {DISCORD_BOT_TOKEN} = process.env;
const Discord = require('discord.js');
const karma = require('./karma');
const quip = require('./quip');
const links = require('./links');

const client = new Discord.Client();

const isGivingKarmaRegex = /<@\!\w*>\s\++/g;
const isCreatingKarmaQuip = /^\!quip\s/g;
const isAddingLinkRegex =/\!link add/g;
const isGettingLinksRegex = /^!links$/g;

client.once('ready', () => {
  console.log('Ready!');
});

interface User {
  username: string
}

interface Message {
  content: string;
  channel: {
    guild: {
      id: number
    }
    send: ((msg: string) => undefined)
  }
  mentions: {
    users: Map<number, User>
  }
}

interface UpdatedKarma {
  username: string;
  updatedKarma: number
}

client.on('message', async (message: Message) => {
  const {
    content,
    channel: {
      guild: {id: guildId},
    },
    mentions: {users: mentionedUsers},
  } = message;
  const isGivingKarma = isGivingKarmaRegex.test(content);
  const isCreatingKarma = isCreatingKarmaQuip.test(content);


  // handle awarding of karma
  if (isGivingKarma && mentionedUsers.size > 0) {
    const karmaToAdd = (content.match(/\+/g) || []).length;

    const updatedKarmas: UpdatedKarma[] = await karma.awardKarma({
      karmaToAdd,
      mentionedUsers,
      guildId,
      message,
    });

    const randomQuip = await quip.getRandomQuip(guildId);

    updatedKarmas.forEach(({username, updatedKarma}) => message.channel.send(
        `**${username}** now has ${updatedKarma} karma. ${randomQuip}`,
    ));;
  }

  // handle adding of quips
  if (isCreatingKarma) {
    const quipToCreate = content.replace(isCreatingKarmaQuip, '');

    await quip.createQuip(quipToCreate);

    message.channel.send('Created a quip!');
  }

  if (isAddingLinkRegex.test(content)) {
    const [linkName, linkHref] = content.replace(isAddingLinkRegex, '')
      .split(' ');

    await links.createLink({
      linkName,
      linkHref,
      guildId
    });

    message.channel.send('Created a link!');
  }

  if (isGettingLinksRegex.test(content)) {
    const results = await links.getLinks({ guildId });

    message.channel.send(results);
  }

  console.info('----------------------------------');
  console.info('>> received message:', content);
  console.info('>> giving karma:', isGivingKarma);
  console.info('>> creating a quip:', isCreatingKarma);
  console.info('>> users mentioned:', mentionedUsers.size);
});

client.login(DISCORD_BOT_TOKEN);
