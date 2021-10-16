const { ChartJSNodeCanvas  } = require('chartjs-node-canvas');
const { MessageAttachment } = require('discord.js');
const db = require('../../utils/db');

const emotes = [];
const count = [];

function getEmoteData() {
    db.query(`SELECT * FROM emote_usage`, (err, rows) => {
        if (err) throw err;
        for (const emoteItem of rows) {
            emotes.push(emoteItem.code);
            count.push(emoteItem.count);
        }
        console.log(emotes, count)
    });
}

const width = 800;
const height = 600;

const chartCallback = (ChartJS) => {}

module.exports = {
    name: "chart",
    description: "List top emotes.",
    Perms: "ADMINISTRATOR",

    execute(client, interaction) {
        const canvas = new ChartJSNodeCanvas({ width, height });
        
        const configuration = { 
            type: 'bar', 
            data: {
                labels: count,
                datasets: [
                    {
                        label: "Most used Emotes",
                        data: emotes,
                        backgroundColor: '#7289d9'
                    },
                ],
            },
        }

        const image = canvas.renderToBuffer(configuration);
        const attachment = new MessageAttachment(image);
        interaction.reply(attachment);
    }
}