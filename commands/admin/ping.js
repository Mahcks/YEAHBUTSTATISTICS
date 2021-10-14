const {MessageEmbed} = require('discord.js');

module.exports = {
    name: "ping",
    description: "Ping the bot",
    Perms: "ADMINISTRATOR",
    execute(client, interaction, arguments) {

        const Response = new MessageEmbed()
        .setTitle("Pong!")
        .setDescription(`Latency: ${client.ws.ping}ms`)

        interaction.reply({embeds: [Response]});
    }
}