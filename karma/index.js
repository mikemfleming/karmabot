const {Karma} = require('../db');

exports.awardKarma = async ({karmaToAdd, mentionedUsers, guildId}) => {
  const results = [];

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

    results.push({
      username,
      updatedKarma: updatedDocument.karma,
    });
  }

  return results;
};
