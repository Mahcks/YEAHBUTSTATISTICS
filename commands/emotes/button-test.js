/*const Discord = require('discord.js');

module.exports = {
    name: "bt",
    aliases: [],
    execute: async(client, message, args) => {

        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setLabel("primary")
                .setStyle("LINK")
                .setURL("https://www.twitch.tv/")
        );

        message.channel.send({ content: "Hello world!", components: [row] });

        const filter = (interaction) => {
            if (interaction.user.id === message.author.id) return true;
            return interaction.reply({ content: "Used button" });
        };

        const collector = message.channel.createMessageComponentCollector({
            filter,
            max: 1,
        });

        collector.on("end", (ButtonInteraction) => {
            const id = ButtonInteraction.first().customId;

            if (id === "https://www.twitch.tv/") return message.channel.send("Test reply")
        });
        
    }
}*/