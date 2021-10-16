const {MessageEmbed, MessageButton} = require('discord.js');
const embedGen = require('../../utils/embedGenerator')

module.exports = {
    name: "leaderboards",
    description: "List top emotes.",
    alias: ["lb"],
    Perms: "ADMINISTRATOR",
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * 
     */

    execute(client, interaction) {
        embedGen.fetchAndUpdateTopLeaderboards(client);
    }
}