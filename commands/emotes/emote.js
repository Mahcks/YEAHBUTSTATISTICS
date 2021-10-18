const Discord = require('discord.js');
var db = require('../../utils/db');
require('dotenv').config();

const emoteArray = [];
let fetchedEmotes = [];

module.exports = {
    name: "emote",
    description: "Search for a specific emote in the database.",
    Perms: "ADMINISTRATOR",
    execute(client, interaction, arguments) {
        // !emote [search(specific emote)/list(grabs all emotes)] [code]
        testResponse = "";
        
        if (arguments[0] === "search") {
            var stringToSearch = arguments[1]
        
            // means that discord autocompleted into an emote, so split it up and search that emote
            if (stringToSearch.includes('<')) {
                stringToSearch = arguments[1].substring(arguments[1].indexOf(':') + 1, arguments[1].lastIndexOf(':'));
            } else {
                stringToSearch = arguments[1]
            }
            var authorEmbed = "";
                db.query(`SELECT * FROM emotes WHERE code = ?;`, [stringToSearch], (err, row) => {
                        if (row) {
                            if (row[0].type === "bttv" || row[0].type === "bttv-shared") {
                                authorEmbed = "https://pbs.twimg.com/profile_images/1213131979849420800/2Dcrsa6f_400x400.png";
                            } else if (row[0].type === "ffz") {
                                authorEmbed = "https://pbs.twimg.com/profile_images/723606757805838341/jvdqxQpL_400x400.jpg";
                            } else if (row[0].type === "7tv") {
                                authorEmbed = "https://avatars.githubusercontent.com/u/79559531?s=200&v=4";
                            }
                            
                            if (row[0].imagetype === "png" || "gif") {
                                var emoteSearchEmbed = new Discord.MessageEmbed()
                                .setAuthor(`${row[0].type.toUpperCase()}`, authorEmbed)
                                .setTitle(`${row[0].code}`)
                                .setURL(row[0].url)
                                .setDescription(`[Image mirror](${row[0].imageurl})\nID: ${row[0].id}\nFormat: ${row[0].imagetype}`)
                                .setThumbnail(row[0].imageurl)
                               interaction.reply({ embeds: [emoteSearchEmbed]});

                            } else if (row[0].imagetype === "webp" ) {
                                var emoteSearchEmbed2 = new Discord.MessageEmbed()
                                .setAuthor(`${row[0].type.toUpperCase()}`, authorEmbed)
                                .setTitle(`${row[0].code}`)
                                .setURL(row[0].url)
                                .setDescription(`[Image mirror](${row[0].imageurl})\nID: ${row[0].id}\nFormat: ${row[0].imagetype}`)
                                .setThumbnail(row[0].imageurl)
                                interaction.reply({ embeds: [emoteSearchEmbed]});
                            }
                            
                        } else {
                            interaction.reply("Emote not found")
                        }
                });
            
        } else if (arguments[0] === "list") {
            if (arguments[1] === "ffz") {
                fetchedEmotes = []
                db.query(`SELECT * FROM emotes WHERE type = "ffz"`, (err, row) => {
                    if (err) throw err;
                    for (let i = 0; i < row.length; i++) {
                        fetchedEmotes.push({
                            id: row[i].id,
                            code: row[i].code,
                        });
                    }
                    testJson = JSON.stringify(fetchedEmotes)
                    interaction.reply(testJson);
                });
            } else if (arguments[1] === "bttv") {
                    fetchedEmotes = []
                db.query(`SELECT * FROM emotes WHERE type = "bttv"`, (err, row) => {
                    if (err) throw err;
                    for (let i = 0; i < row.length; i++) {
                        fetchedEmotes.push({
                            id: row[i].id,
                            code: row[i].code,
                        });
                    }
                    console.log(fetchedEmotes);
                });
            } else if (arguments[1] === "7tv") {
                fetchedEmotes = []
                db.query(`SELECT * FROM emotes WHERE type = "7tv"`, (err, row) => {
                    if (err) throw err;
                    for (let i = 0; i < row.length; i++) {
                        fetchedEmotes.push({
                            id: row[i].id,
                            code: row[i].code,
                        });
                    }
                });
                console.log(fetchedEmotes);
            }
        }
    }
}
