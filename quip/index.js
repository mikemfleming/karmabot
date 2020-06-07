const {Quip} = require('../db');

exports.createQuip = async (quip) => {
  return await Quip.create({quip});
};
