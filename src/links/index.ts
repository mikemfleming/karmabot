const { Link } = require('../db');

interface CreateArguments {
  linkName: String
  linkHref: String
  guildId: number
}

exports.createLink = async ({ linkName, linkHref, guildId }: CreateArguments) => {
    return await Link.findOneAndUpdate({
        guildId,
        linkHref,
        linkName
    },
    { linkName },
    {
        new: true,
        upsert: true,
        useFindAndModify: false,
    });
}

interface GetArguments {
    guildId: number
}

exports.getLinks = async ({ guildId }: GetArguments) => {
    return await Link.find({ guildId });
}
