const Discord = require('discord.js');
var db = require('../../utils/db');
const fs = require('fs');
require('dotenv').config();

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

function storeData(data) {
    fs.writeFile(`./exportedData.txt`, data.toString(), 'utf8', function(err) {
        if (err) { 
            console.log(err);
        } else {
            console.log(`Wrote date to exportedData.txt`);
        }
    });
}

function convertToCSV(objArray) { 
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str
}

function exportCSVFile(headers, items, fileTitle, interaction, message) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);

    var exportedFilename = fileTitle + '.csv' || 'export.csv';

    //writeCSV(exportedFilename, csv);    
    fs.writeFile(exportedFilename, csv, 'utf8', function(err) {
        if (err) { 
            console.log(err);
        } else {
            console.log(`Wrote date to ${exportCSVFile}`);
        }
    });

    interaction.reply({ content: `${message} generated ${dateTime}`, files: [exportedFilename] });
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
            var emotesData = [];
            
            db.query(`SELECT * FROM emotes`, (err, rows) => {
                if (err) throw err;
                for(i = 0; i < rows.length; i++) {
                    emotesData.push({ 
                        code: rows[i].code,
                        type: rows[i].type,
                        format: rows[i].imagetype,
                        id: rows[i].id,
                        url: rows[i].url
                    });
                }
                //storeData(emotesData);
                var fileTitle = "emotes_data";
                var headers = { code: "Emote", type: "Platform", format: "Format", id: "ID", url: "URL" };
                exportCSVFile(headers, emotesData, fileTitle, interaction, "Emote data");
            });

        } else if (arguments[0] === "usage") {
            var usageData = [];

            db.query(`SELECT * FROM emote_usage`, (err, rows) => {
                if (err) throw err;
                for (var i = 0; i < rows.length; i++) {
                    usageData.push({ 
                        code: rows[i].code,
                        count: rows[i].count
                    });
                }
                var fileTitle = "emote_usage";
                var headers = { code: "Emote", count: "Count" };

                // Sort and split the array into chunks of 25
                var compare = function(a, b) {
                    return parseInt(b.count) - parseInt(a.count);
                }

                var sortedArray = usageData.sort(compare);

                exportCSVFile(headers, sortedArray, fileTitle, interaction, "Emote usage");
            });
        }
    }
}
