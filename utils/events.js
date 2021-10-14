const fs = require('fs');

module.exports = async (client) => {
    const eventFiles = fs.readdirSync('./events/').filter((file) => file.endsWith('.js'));

	for(const file of eventFiles) {
		const event = require(`../events/${file}`);
		const eventName = file.slice(0, -3);

		client.on(eventName, event.bind(null, client));

		console.log(`\x1b[31m[LOGS] \x1b[33m[EVENTS] \x1b[36m${eventName}\x1b[37m has been loaded.\x1b[0m`);
		//                RED            YELLOW          CYAN                 WHITE                    RESET TO DEFAULT COLOR
	}
}

