// TO-DO:
//  - add database
//  - deploy
//  - dynamically add fun messages
//  - see karma total
//  - decrement karma?

const { DISCORD_BOT_TOKEN } = process.env;
const Discord = require('discord.js');
const client = new Discord.Client();

const db = {};
const isGivingKarmaRegex = /<@\!\w*>\s\+*/g

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    const {
        content,
        channel: {
            guild: { id: guildId }
        },
        mentions: { users: mentionedUsers }
    } = message;

    if (isGivingKarmaRegex.test(content) && mentionedUsers.size > 0) {
        const karmaToAdd = (content.match(/\+/g)||[]).length;

        for ([userId, { userName }] of mentionedUsers) {
            if (!db[guildId]) {
                db[guildId] = {};
            }

            if (!db[guildId][userId]) {
                db[guildId][userId] = 0;
            }

            db[guildId][userId] += karmaToAdd;

            message.channel.send(`User ${userName} has ${db[guildId][userId]} karma. Way to go!`);
        }
    }
});

client.login(DISCORD_BOT_TOKEN);
