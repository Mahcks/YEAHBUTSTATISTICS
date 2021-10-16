const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
var db = require('./db');
var testArray = [];
var lbArray = [];
const fs = require('fs');

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;


/*
Ideas on how to store the page information
JSON - SQL or local?

= JSON Format =
{
    "pages": {
        "page1": {
            "emote_code": "emote_usage",
        },
        "page2": {
            "emote_code": "emote_usage",
        },
        "page3": {
            "emote_code": "emote_usage",
        },
    }
}

[X] Make a way to post to a specific channel with the embed
[X] Get all of the tracked emotes
[X] Split the emote array into chunks of 25 to get around the 25 field limit
[X] Split each chunk into pages 


10/14/21 TODO
Fetch 

*/

// Fetch the embed and update it with an embed
function fetchMessageAndUpdate(platform, data, client) {
    db.query(`SELECT * FROM embeds WHERE platform = ?`, [platform], (err, rows) => {
        console.log(rows[0].channel_id, rows[0].message_id);
        var guild = client.guilds.cache.get('895033377336463380');
        var channel = guild.channels.cache.find(c => c.id === rows[0].channel_id);
        channel.messages.fetch(rows[0].message_id).then(msg => {
            msg.edit(data);
            msg.reactions.removeAll();
            }).catch(err => {
                console.log(err);
        });
    });
}


// Split the usage array into chunks of 25 so the embed still works
function chunkPages(arr, chunked) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunked) {
        const chunk = arr.slice(i, i + chunked);
        res.push(chunk);
    }
    return res;
}

function createPages(arr) {
    var pages = {};
    pages["page_count"] = 1;
    pages["pages"] = [arr];
    //console.log(`Split into ${arr.length} pages: ` + pages);

    return JSON.stringify(pages);
}

function storePages(arr) {
    console.log("storePages", arr)
    fs.writeFileSync("embeds.json", arr, (err) => {
        if (err) {
            console.log(err)
        } else 
        console.log("Embed written sucessfuly") 
    });
}

// Create pages for an embed 
function createEmbedData() {
    db.query(`SELECT * FROM emote_usage`, (err, rows) => {
        if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
            testArray.push({
                code: rows[i].code,
                count: rows[i].count
            });
        }
        // Sort and split the array into chunks of 25
        var compare = function(a, b) {
            return parseInt(b.count) - parseInt(a.count);
        }

        var newArray = testArray.sort(compare);

        /*var chunkedArray = chunkPages(newArray, 25);
        
        // Make the array into a JSON object
        var createdPages = createPages(chunkedArray);

        // Store the page data
        var finishedPages = storePages(createdPages);

        
        return finishedPages;*/
        return newArray;
    });
}

function createEmbedButtons() {
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("nextPage")
            .setLabel("=>")
            .setStyle("PRIMARY"),

        new MessageButton()
            .setCustomId("previousPage")
            .setLabel("<=")
            .setStyle("SECONDARY")
    );
    
    db.query(`SELECT * FROM embeds WHERE platform = ?`, [platform], (err, rows) => {
        console.log(rows[0].channel_id, rows[0].message_id);
        var guild = client.guilds.cache.get('895033377336463380');
        var channel = guild.channels.cache.find(c => c.id === rows[0].channel_id);
        channel.messages.fetch(rows[0].message_id).then(msg => {
            console.log(msg);    
            msg.edit({embeds: [embed]});
            }).catch(err => {
                console.log(err);
        });
    });
}

function createEmbed() {
    
}

// Creates the data for the message and updates the message
function fetchAndUpdateTopLeaderboards(client) {
    // Fetch the data to display 
    db.query(`SELECT * FROM emote_usage`, (err, rows) => {
        if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
            lbArray.push({
                code: rows[i].code,
                count: rows[i].count
            });
        }
        // Sorting method
        var compare = function(a, b) {
            return parseInt(b.count) - parseInt(a.count);
        }

        var newArray = lbArray.sort(compare);
        
        var textArray = [];
        for (i = 0; i < newArray.length; i++) {
            textArray.push(`${newArray[i].code} - ${newArray[i].count}`);
        }

        var chunkedArray = chunkPages(textArray, 25);
        
        var finalMessage = JSON.stringify(chunkedArray[0]).split(",").join("\n").replace(/[\[\]'"]+/g, '')
        
        // Updates the message
        fetchMessageAndUpdate("all", `**Top 25 Used Emotes - ${dateTime}**\n\n${finalMessage.replace()}`, client);
    });
}

function leaderboardUpdateButton() {
    
}

module.exports = async (client) => {
    console.log(client)
}

//fetchEmbedAndUpdate
module.exports = { chunkPages, createEmbedData, createPages, createEmbed, fetchMessageAndUpdate, fetchAndUpdateTopLeaderboards }