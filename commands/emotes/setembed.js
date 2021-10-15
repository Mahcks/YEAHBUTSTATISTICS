const { MessageEmbed, MessageButton } = require('discord.js');
const embedGen = require('../../utils/embedGenerator');
var db = require('../../utils/db');
var tf = require('../../twitch/twitchFunctions');
const paginationEmbed = require('discordjs-button-pagination');
const {pagination} = require('reconlx');

var testResponse = "";

var testArray = [];
var chunkedEmotes = [];
let chunkSize = 25;

/*

    Embed plan
    - 25 fields for 25 emotes per page
    - Buttons
        [ ] Skip to beginning
        [ ] Back a Page
        [ ] Next Page
        [ ] Skip to end page

    = EMBED LIMITS =
    Embed titles are limited to 256 characters
    Embed descriptions are limited to 4096 characters
    There can be up to 25 fields
    A field's name is limited to 256 characters and its value to 1024 characters
    The footer text is limited to 2048 characters
    The author name is limited to 256 characters
    The sum of all characters from all embed structures in a message must not exceed 6000 characters
    Ten embeds can be sent per message

*/

function storeEmbedMessage(platform, channelId, messageId) {
    db.query(`SELECT 1 FROM embeds WHERE platform = ?;`, [platform], (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) {
            db.query(`INSERT INTO embeds (platform, channel_id, message_id) VALUES (?, ?, ?);`, [platform, channelId, messageId], (err, rows) => {
                if (err) throw err;
            });
        } else {
            db.query(`UPDATE embeds SET message_id = ? WHERE platform = ?`, [messageId, platform], (err, rows) => {
                if (err) throw err;
                console.log(`Updated with ${platform} has been updated with ${messageId}`);
            });
        }
    });
}

module.exports = {
    name: "e",
    description: "Update all the emote embeds",
    Perms: "ADMINISTRATOR",
    // This will set embed channel for bttv/ffz/7tv. Each channels embed will constantly update with information.
    execute(client, interaction, arguments) {
            embedGen.fetchAndUpdateLeaderboards(client);
            
    }
}
