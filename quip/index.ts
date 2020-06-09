const {Quip} = require('../db');

exports.createQuip = async (quip: string) => {
  return await Quip.create({quip});
};

exports.getRandomQuip = async (guildId: number) => {
  const [{quip: randomQuip}] = await Quip.aggregate([{$sample: {size: 1}}]);
  return randomQuip;
};
