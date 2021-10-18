const {MessageEmbed} = require('discord.js');
require('dotenv').config();

module.exports = {
    name: "help",
    description: "Displays help menu",
    Perms: "ADMINISTRATOR",
    execute(client, interaction, arguments) {

        const Response = new MessageEmbed()
        .setTitle("YEAHBUTSTATISTICS")
        .setDescription(``)
        .addFields(
            { name: "!emote [search] [code]", value: "Get data from an emote."},
            { name: "!emote list [bttv/ffz/7tv]", value: "Retrieves a specific platforms emotes."},
            { name: "!export [emotes/usage]", value: "Exports all the emotes or emote usage as CSV files." },
            { name: "!leaderboards", value: "Fetches and updates the leaderboards." }
        )
        .setFooter(`v${process.env.VERSION}`)
        
        interaction.reply({embeds: [Response]});
    }
}