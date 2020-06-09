# karmabot
A Discord bot for awarding karma to your friends.

Add it to your Discord server [here](https://discord.com/oauth2/authorize?client_id=719188825053724703&scope=bot).

# Whiteboard
Karmabot is a single instance of the app managed by pm2 on an ec2 server. The app initializes a connection with Discord and a MongoDB replica set on startup. It listens to messages from subscribed channels and executes bot logic based on what it recieves. 

Give karma by mentioning a user with as much karma as you want.
```
@callidus ++++++ --> Callidus has 5 karma. Nice!
```
You can also customize the congratulatory phrase by adding your own quip.
```
!quip A goodly hit! --> Callidus has 5 karma. A goodly hit!
```

# Setup
```
# install OS deps
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
. ~/.nvm/nvm.sh
sudo yum install -y git
npm i -g pm2

# install source code and deps
git clone https://github.com/mikemfleming/karmabot.git
cd karmabot
nvm use
npm i

# transpile ts code
npm run build

# start 3 load balanced instances
pm2 start build/main.js
```
