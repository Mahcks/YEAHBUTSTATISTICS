const {MessageEmbed} = require('discord.js');
require('dotenv').config();

module.exports = {
    name: "help",
    description: "Displays help menu",
    Perms: "ADMINISTRATOR",
    execute(client, interaction, arguments) {

        const Response = new MessageEmbed()
        .setDescription(``)
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .addFields(
            { name: "!emote [search] [code]", value: "Search data for an emote."},
            { name: "!emote list [bttv/ffz/7tv]", value: "Retrieves a specific platforms emotes."},
            { name: "!export [emotes/usage]", value: "Exports all the emote data to a CSV file." },
            { name: "!export [usage] [optional: timestamps]", value: "Exports emote usage data to a CSV file. Timestamps are optional because files can be large." },
            { name: "!leaderboards", value: "Fetches and updates the leaderboards." }
        )
        .setFooter(`v${process.env.VERSION}`)
        .setTimestamp()

        interaction.reply({embeds: [Response]});
    }
}