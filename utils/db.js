const { createConnection } = require('mysql');

const config = require('../config.json');

let con = createConnection(config.mysql);

con.connect(err => {
    if (err) return console.log(err);

    console.log(`\x1b[31m[LOGS] \x1b[35m[STATUS] \x1b[36mDATABASE\x1b[37m is now connected.\x1b[0m`);
})

module.exports = con;