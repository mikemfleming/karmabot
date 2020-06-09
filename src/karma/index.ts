const { Karma } = require('../db');

interface Arguments {
  karmaToAdd: number
  mentionedUsers: Map<number, { username: string }>
  guildId: number
}

exports.awardKarma = async ({ karmaToAdd, mentionedUsers, guildId }: Arguments) => {
  const results = [];

  for (const [userId, { username }] of mentionedUsers) {
    const updatedDocument = await Karma.findOneAndUpdate({
      guildId,
      userId,
    },
      {
        $inc: { karma: karmaToAdd },
      },
      {
        new: true,
        upsert: true,
        useFindAndModify: false,
      });

    results.push({
      username,
      updatedKarma: updatedDocument.karma,
    });
  }

  return results;
};
