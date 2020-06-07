const {MONGODB_CONN} = process.env;

const mongoose = require('mongoose');
mongoose.connect(MONGODB_CONN, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected!');
});
const karmaSchema = new mongoose.Schema({
  guildId: Number,
  userId: Number,
  karma: Number,
});

exports.Karma = mongoose.model('Karma', karmaSchema);
