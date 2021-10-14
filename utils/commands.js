const fs = require('fs');
const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);

module.exports = async (client) => {
	const commandFiles = await globPromise(`${process.cwd()}/commands/*/*.js`)
	
	commandsArray = [];

	commandFiles.map(async (commandFile) => {
		const command = await require(commandFile);

		if (!command.name) return;
		if (command.Perms) command.defaultPermissions = false;

		const C = commandFile.split("/");

		console.log(`\x1b[31m[LOGS] \x1b[32m[CMDS] \x1b[36m${command.name.toUpperCase()}[${C[C.length - 2]}]\x1b[37m has loaded.\x1b[0m`);
		//               RED              MAGENTA       CYAN                   WHITE               RESET TO DEFAULT COLOR

		await client.commands.set(command.name, command);
		commandsArray.push(command);
	});

	client.on('ready', async () => {
		const MainGuild = await client.guilds.cache.get("895033377336463380");

		MainGuild.commands.set(commandsArray).then((command) => {
			const Roles = (commandName) => {
				const cmdPerms = commandsArray.find((c) => c.name === commandName).Perms;

				if (!cmdPerms) return null;

				return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms) && !r.managed);
			};

			const fullPermissions = command.reduce((accumulator, x) => {
				const roles = Roles(x.name);
				if (!roles) return accumulator;

				const permissions = roles.reduce((a, v) => {
					return [...a, {id: v.id, type: "ROLE", permission: true}]
				}, []);

				return [...accumulator, {id: x.id, permissions}]
			}, []);

			MainGuild.commands.permissions.set({ fullPermissions });
		});
	});

};

/*

const commandsFiles = fs.readdirSync('./commands/');	
	for(const dir of commandsFiles) {

		const files = fs.readdirSync(`./commands/${dir}`).filter((file) => file.endsWith('.js'));

		for(const file of files) {
			const object = require(`../commands/${dir}/${file}`);

			client.commands.set(object.name, object);

			object.aliases.forEach((alias) => {
				client.aliases.set(alias, object.name);
			});

		}
	}


*/