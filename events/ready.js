var db = require('../utils/db');

module.exports = async (client) => {
    console.log(`\x1b[31m[LOGS] \x1b[35m[STATUS] \x1b[36mYEAHBUTSTATISTICS\x1b[37m is now online.\x1b[0m`);

    db.query(`SELECT COUNT(*) FROM emotes`, (err, row) => {
        console.log();
        client.user.setPresence({ activities: [{ name: `${row[0]["COUNT(*)"]} emotes`, type: "WATCHING"}] });
    })
};