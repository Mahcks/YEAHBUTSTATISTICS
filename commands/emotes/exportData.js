const Discord = require('discord.js');
var db = require('../../utils/db');
require('dotenv').config();


function fetchTable(table) {
    db.query(`SELECT * FROM ?`, [table], (err, rows) => {
        if (err) throw err;
        console.log(rows);
    });
}

module.exports = {
    name: "export",
    description: "Exports emote data.",
    Perms: "ADMINISTRATOR",
    execute(client, interaction, arguments) {
        /*
            !export [emotes/usage]
        */
        // 1. Get the data from the database
        if (arguments[0] === "emotes") {
            db.query(`SELECT * FROM emotes`, (err, rows) => {
                if (err) throw err;
                console.log("emotes", rows);
            });

        } else if (arguments[0] === "usage") {
            db.query(`SELECT * FROM emote_usage`, (err, rows) => {
                if (err) throw err;
                console.log("emote_usage", rows)
            });
        }
    }
}
