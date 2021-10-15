/*const {MessageEmbed, MessageButton} = require('discord.js');
const embedGen = require('../../utils/embedGenerator')

module.exports = {
    name: "leaderboards",
    description: "List top emotes.",
    Perms: "ADMINISTRATOR",
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * 
     */

    /*execute(client, interaction) {
        try {
            if (!interaction.isCommand()) return;

            await interaction.deferReply().catch((_) => {});

            var embedData = embedGen.createEmbedData();

            let pageNo = 1;

            const embed = new MessageEmbed()
                .setColor("WHITE")
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                .setAuthor("Top 25 emotes")
                .setTimestamp()
                .setFooter(`Page ${pageNo}/${embedData.length}`)

            const getButtons = (pageNo) => {
                return new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("Previous")
                        .setCustomId("prev")
                        .setStyle("SUCCESS")
                        .setDisabled(pageNo <= 1),
                    new MessageButton()
                        .setLabel("Next")
                        .setCustomId("next")
                        .setStyle("SUCCESS")
                        .setDisabled(!(pageNo < embedData.length)),
                );
            };

            embed.setDescription(`**${embedData[pageNo - 1].name}**`).addFields(
                embedData[pageNo - 1].code.map(({ name, description }) => {
                    return { 
                        name: `\`${name}\``,
                        value: `${description}`,
                        inline: true,
                    };
                }),
            );

            const intrMsg = await interaction.editReply({ embeds: [embed], components: [getButtons(pageNo)], fetchReply: true});
            const collector = intrMsg.createMessageComponentCollector({ time: 600000, componentType: "BUTTON" });

            collector.on("collect", async (i) => {
                if (i.customId === "next") {
                    pageNo++;
                } else if (i.customId === "prev") {
                    pageNo--;
                }

                const categ = embedData[pageNo - 1];

                embed.fields = []
                embed.setDescription(`**${categ.code}**`).addFields(
                    categ.code.map(({ name, description }) => {
                        return {
                            name: `\`${name}\``,
                            value: `${description}`,
                            inline: true,
                          };
                    }),
                ).setFooter(`Page ${pageNo}/${embedData.length}`);

                await i.update({ embeds: [embed], components: [getButtons(pageNo)], fetchReply: true });
            });
            
        } catch (err) {
            console.log("Something went wrong => ", err);
        }
    }
}*/