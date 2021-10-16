const fetch = require('node-fetch');
const fs = require('fs');
const SevenTV = require('7tv');
var db = require('../utils/db');
require('dotenv').config();

const api = SevenTV();

const bttvAPI = `https://api.betterttv.net/3/cached/users/twitch/${process.env.CHANNEL_ID}`
const ffzAPI = `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${process.env.CHANNEL_ID}`
	
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

const totalArray = [];
const bttvArray = [];
const ffzArray = [];
const seventvArray = [];
const totalCount = {};

let localPlatforms = [];
let localEmotes = [];
let localCodes = [];
let storedCodes = [];

// Uploading an emote to SQL
async function storeEmote(id, code, url, imageType, imageURL, type) {
    db.query(`INSERT INTO emotes (id, code, url, imagetype, imageurl, type) VALUES (?, ?, ?, ?, ?, ?);`, [id, code, url, imageType, imageURL, type], (err, rows) => {
        if (err) throw err;
            console.log(`[SQL] Emote ${code} stored with ID: ${rows.insertId}`);
    });
}

// Triggers when the emote is used, appends it to its respective collection
async function emoteUsed(emoteMap) {
    for (const [key, value] of Object.entries(emoteMap)) {
        db.query(`SELECT 1 FROM emote_usage WHERE code = ?;`, [key], (err, rows) => {
            if (err) throw err;
            if (rows.length === 0) {
                // emote does not exist, make it with +1 usage in emote_usage
                db.query(`INSERT INTO emote_usage (code, platform, count, time_stamps) VALUES (?, ?, ?, ?);`, [key, fetchPlatfromFromCode(key), value, dateTime], (err, rows) => {
                    if (err) throw err;
                    console.log(`[EMOTE_USAGE] ${key} added`);
                });

            } else {
                // emote exists, update count +1 and add the timestamp
                db.query(`UPDATE emote_usage SET count = count + ? WHERE code = ?`, [value, key], (err, rows) => {
                    if (err) throw err;
                    db.query(`UPDATE emote_usage SET time_stamps = CONCAT(time_stamps, '|',  ?) WHERE code = ?`, [dateTime, key], (err, rows) => {
                        if (err) throw err;
                        console.log(`[EMOTES] ${key}: ${value}`);
                    });
                });
            }
        });
    }    
}

// Fetches Database emotes and stores them into an array.
async function fetchEmoteIds() {
    db.query("SELECT id FROM emotes", function(err, result, fields){
        if (err) throw err;
        var testResult = Object.values(JSON.parse(JSON.stringify(result)));
        for (let i = 0; i < testResult.length; i++) {
            storedCodes.push(testResult[i].id);
        }
    });
}

// Read emotes.json and store the data into an array.
async function fetchLocalIds() {
    fs.readFile('emotes.json', (err, data) => {
        if (err) throw err;
        let emotes = JSON.parse(data);
        for (let i = 0; i < emotes.length; i++) {
            localCodes.push(emotes[i]["code"]);
            localPlatforms.push(emotes[i]["platform"]);
        }
    });
}

// Fetch the platform of an emote
var retrievedPlatform = "";
function fetchPlatfromFromCode(emoteCode) {
    db.query(`SELECT * FROM emotes WHERE code = ?;`, [emoteCode], (err, rows) => {
        retrievedPlatform = rows[0].type;
    });

    return retrievedPlatform;
}

// Writes JSON file locally to store emotes
async function storeEmotesLocally(json) {
    fs.writeFile("./emotes.json", json, 'utf8', function(err) {
            if (err) { 
                console.log(err);
            } else {
                console.log("* Updated emotes json");
            }
        });
}

// Activily checks if the local JSON is out of date from APIs that BTTV/FFZ provide
// If there is a difference remove/add/update the field in Database.
async function weWide() {

    // First we grab the local JSON since we know it'll be the most up to date.
    fetchLocalIds();

    // Then we grab every emote from SQL by ID
    fetchEmoteIds();

    // Compare both localIds and storedIds
    var difference = storedCodes.filter(x => localCodes.indexOf(x) === -1);
    if (difference.length === 0) {
        console.log("[SQL] Database is up to date");
    } else {
        console.log("[SQL] Database is behind: " + difference + " attempting to solve the problem...");
        // Update SQL
        getEmotes();
    }
}

// Function that merges all emotes into one array for easy usage. 
async function getEmotes() {
    const bttvResponse = await fetch(bttvAPI);
    var bttvData = await bttvResponse.json();

    const ffzResponse = await fetch(ffzAPI);
    var ffzData = await ffzResponse.json();

    const emotes = await api.fetchUserEmotes(process.env.CHANNEL_ID);
    for (let i = 0; i < emotes.length; i++) {
        seventvArray.push({
            id: emotes[i]['id'],
            code: emotes[i]['name'],
            url: `https://7tv.app/emotes/${emotes[i]['id']}`, 
            type: "webp",
            imageURL: `https://cdn.7tv.app/emote/${emotes[i]['id']}/4x`,
            source: "7tv"
        });
        //storeEmote(emotes[i]["id"], emotes[i]["name"], `https://7tv.app/emotes/${emotes[i]['id']}`, "webp", `https://cdn.7tv.app/emote/${emotes[i]['id']}/4x`, "7tv");
    }

    if(bttvResponse) { 
        for(let i = 0; i < bttvData['channelEmotes'].length; i++) {
            bttvArray.push({
                id: bttvData['channelEmotes'][i]['id'],
                code: bttvData['channelEmotes'][i]['code'],
                url: `https://betterttv.com/emotes/${bttvData['channelEmotes'][i]['id']}`,
                type: bttvData['channelEmotes'][i]['imageType'],
                imageURL: `https://cdn.betterttv.net/emote/${bttvData['channelEmotes'][i]['id']}/3x`,
                source: "bttv"
            })
            //storeEmote(bttvData['channelEmotes'][i]['id'], bttvData['channelEmotes'][i]['code'], `https://betterttv.com/emotes/${bttvData['channelEmotes'][i]['id']}`, bttvData['channelEmotes'][i]['imageType'], `https://cdn.betterttv.net/emote/${bttvData['channelEmotes'][i]['id']}/3x`, "bttv")
        }
        for(let i = 0; i < bttvData['sharedEmotes'].length; i++) {
            bttvArray.push({
                id: bttvData['sharedEmotes'][i]['id'],
                code: bttvData['sharedEmotes'][i]['code'],
                url: `https://betterttv.com/emotes/${bttvData['sharedEmotes'][i]['id']}`,
                type: bttvData['sharedEmotes'][i]['imageType'],
                imageURL: `https://cdn.betterttv.net/emote/${bttvData['sharedEmotes'][i]['id']}/2x`,
                source: "bttv-shared"
            })
            //storeEmote(bttvData['sharedEmotes'][i]['id'], bttvData['sharedEmotes'][i]['code'], `https://betterttv.com/emotes/${bttvData['sharedEmotes'][i]['id']}`, bttvData['sharedEmotes'][i]['imageType'], `https://cdn.betterttv.net/emote/${bttvData['sharedEmotes'][i]['id']}/2x`, "bttv-shared")
        }
    }

    if(ffzResponse) { 
        for (let i = 0; i < ffzData.length; i++) {
            ffzArray.push({
                id: ffzData[i]['id'],
                code: ffzData[i]['code'],
                url: `https://www.frankerfacez.com/emoticon/${ffzData[i]['id']}`,
                type: ffzData[i]['imageType'],
                imageURL: `https://cdn.frankerfacez.com/emote/${ffzData[i]['id']}/2`,
                source: "ffz"
            })
            //storeEmote(ffzData[i]['id'], ffzData[i]['code'], `https://www.frankerfacez.com/emoticon/${ffzData[i]['id']}`, ffzData[i]['imageType'], `https://cdn.frankerfacez.com/emote/${ffzData[i]['id']}/2`, "ffz")
        }
    }

    // Joining the two arrays
    let joinedEmotes = bttvArray.concat(ffzArray);
    let joinedWithSeven = joinedEmotes.concat(seventvArray);
    let joinedJSON = JSON.stringify(joinedWithSeven);

    storeEmotesLocally(joinedJSON);
    console.log("[SQL] Database has been updated with " + joinedJSON.length);
}


function compareEmoteToMessage(message) {
    let splitArray = message.split(" ");
    let emoteMap = {};

    for (var emote of splitArray) {
        var res = localCodes.indexOf(emote);
        if (res != -1) {
            let currentWordCount = emoteMap[localCodes[res]];
            let count = currentWordCount ? currentWordCount : 0;
            emoteMap[localCodes[res]] = count + 1;
        } 

    }
    // Send emote usage to database
    emoteUsed(emoteMap);
}

module.exports = {storeEmote, emoteUsed, getEmotes, fetchLocalIds, fetchEmoteIds, storeEmotesLocally, compareEmoteToMessage, weWide, fetchPlatfromFromCode}