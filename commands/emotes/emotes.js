const Discord = require('discord.js');
var db = require('../../utils/db');

const emoteArray = [];
let fetchedEmotes = [];

module.exports = {
    name: "emotes",
    description: "Displays every emote from each platform.",
    Perms: "ADMINISTRATOR",
    execute(client, interaction, arguments) {
        testResponse = "";
        
        // query the db for all emotes and store them in its own array.
        db.query(`SELECT * FROM emotes`, (err, row) => {
            for (let i = 0; i < row.length; i++) {
                emoteArray.push({
                    type: row[i].type,
                    code: row[i].code,
                    id: row[i].id,
                   
                })
            }
        });

        // if they just do !emotes then show every emote in the list.
        if (arguments[0] === null) {
            console.log('no arguments');

        } else if (arguments[0] === "ffz") {
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
                message.channel.send(testJson);
            });

        } else if (arguments[0] === "bttv") {
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

        } else if (arguments[0] === "7tv") {
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

        if (testResponse == "") {
            testResponse = "Error fetching emotes..."
        }
        
        //message.channel.send(fetchedEmotes.toString());
    }
}