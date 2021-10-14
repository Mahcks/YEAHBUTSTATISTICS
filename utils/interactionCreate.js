module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.followUp({content: "This command no longer exists."}) && client.commands.delete(interaction.commandName);

            const arguments = [];

            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    option.options?.forEach((x) => {
                        if (x.value) arguments.push(option.value);
                    });
                } else if (option.value) arguments.push(option.value);
            };

            command.execute(client, interaction);
        }
    }
}