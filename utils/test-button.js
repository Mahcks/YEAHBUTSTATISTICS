const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === "ping") {
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('primary')
                .setLabel("Primary")
                .setStyle('PRIMARY'),
            );

            await interaction.reply({ content: "Pong!", components: [row] });
        }
    });
}