const {
  DISCORD_BOT_TOKEN,
  MONGODB_CONN,
} = process.env;

module.exports = {
  webpack: (config, options, webpack) => {
    // new entrypoint
    config.entry.main = ['./src/index.ts'];

    // extensions resolution
    config.resolve = {
      extensions: ['.ts', '.js', '.json'],
    };

    // Typescript loader
    config.module.rules.push({
      test: /\.ts$/,
      loader: 'ts-loader',
    });

    // environment variables
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.DISCORD_BOT_TOKEN': JSON.stringify(DISCORD_BOT_TOKEN),
      'process.env.MONGODB_CONN': JSON.stringify(MONGODB_CONN),
    }));

    return config;
  },
};
