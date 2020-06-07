const {Quip} = require('../db');

exports.createQuip = async (quip) => {
  return await Quip.create({quip});
};

exports.getRandomQuip = async (guildId) => {
  const [{quip: randomQuip}] = await Quip.aggregate([{$sample: {size: 1}}]);
  return randomQuip;
};
