const { Client, Collection, Intents } = require("discord.js");
const tmi = require('tmi.js');
const tf = require('./twitch/twitchFunctions');
const eg = require('./utils/embedGenerator');
require('dotenv').config();

/*

Display emotes - !emotes [leave empty for all types/bttv/ffz/7tv]
Some way to update leaderboards live to keep track of emote usage
Way to export emote list/emote usage.

*/

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.commands = new Collection();
client.aliases = new Collection();

// Handlers
require('./utils/events')(client);
require('./utils/commands')(client);

client.login(process.env.BOT_TOKEN);

// Config for tmi.js
const opts = {
    identity: {
      username: process.env.BOT_USERNAME,
      password: process.env.BOT_PASSWORD
    },
    channels: [
      process.env.CHANNEL
    ]
};

// Create client with options
const tmiClient = new tmi.client(opts);

// TMI: Event handlers
tmiClient.on('connected', onConnectedHandler);
tmiClient.on('message', onMessageHandler);

// Connect with the options we've set up
tmiClient.connect();

  // Called for every message received
function onMessageHandler(target, context, msg, self) {
    if (self) { return; }

    // See if any localEmotes are matched to the message a user sends
    console.log(`\x1b[36m${context.username}: \x1b[37m${msg}`);
    tf.compareEmoteToMessage(msg);
}

  // Called everytime bot connects to Twitch
function onConnectedHandler(addr, port) {
    tf.weWide();
    console.log(`\x1b[31m[LOGS] \x1b[35m[STATUS] \x1b[36mTMI\x1b[37m Connected to ${addr}:${port}`);
}

// Interval to run some functions to update any dynamic data.
setInterval(function() {
    eg.fetchAndUpdateTopLeaderboards(client);
    console.log(`Updated top 25 emotes`)

    // 1 minute = 60000 | 5 minutes = 300000
}, 300000);
