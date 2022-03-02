const sqlite3 = require("sqlite3").verbose();
const timezones = require("./timezones.json");
var db = null;

module.exports = {
    open: () => {
        db = new sqlite3.Database(
            "./TimezonesDatabase.db",
            sqlite3.OPEN_READWRITE,
            (err) => {
                if (err) return console.error(err.message);

                console.log("connection successful");
            }
        );

        db.run(
            "CREATE TABLE IF NOT EXISTS timezones(userID PRIMARY KEY, timezone)"
        );
        (err) => {
            if (err) return console.error(err.message);
        };
    },

    setTimezone: (message, timezone) => {
        zonesRegex = /^([a-z]+)$/;
        let userID = message.author.id;
        const zoneMatches = zonesRegex.exec(timezone);
        if (zoneMatches !== null) {
            if (zoneMatches[1] in timezones) {
                let zone = timezones[zoneMatches[1]];
                db.run(
                    `REPLACE INTO timezones (userID, timezone) VALUES ('${userID}', '${zone}')`
                );
                message.channel.send("Successfully set timezone");
                return;
            }
        }

        timezoneRegex = /^(utc[+-]{1}[0-9]{1,2})$/;
        const matches = timezoneRegex.exec(timezone);
        if (matches === null) {
            message.channel.send("Invalid timezone syntax");
            return; // error does not match
        }
        db.run(
            `REPLACE INTO timezones (userID, timezone) VALUES ('${userID}', '${matches[1].toUpperCase()}')`
        );
        message.channel.send("Successfully set timezone");
    },

    getTimezone: (userID) => {
        var query = `SELECT timezone FROM timezones WHERE userID = '${userID}'`;
        return new Promise((resolve, reject) => {
            db.all(query, function (err, rows) {
                if (err) {
                    reject(err);
                }
                if (rows.length > 0) {
                    resolve(rows[0].timezone);
                } else {
                    resolve("UTC+0");
                }
            });
        });
    },

    hasPermissionMulti: (roles) => {
        out = false;
        roles.forEach((role) => {
            if (hasPermission(role.id)) {
                out = true;
            }
        });
        return out;
    },

    createDataBase: (name) => {
        new sqlite3.Database(`${name}.db`);
        console.log(`Successfully created new database called ${name}`);
    },

    printDataBase: () => {
        const sqlRead = "SELECT * FROM timezones";

        db.all(sqlRead, [], (err, rows) => {
            if (err) return console.error(err.message);

            rows.forEach((row) => {
                console.log(row);
            });
        });
    },

    close: () => {
        db.close((err) => {
            if (err) return console.error(err.message);
        });
        console.log("shutdown successful");
    },
};

function hasPermission(id) {
    if (id === "379325076740374528") {
        return true;
    }
    if (id === "279437266491801602") {
        return true;
    }
    if (id === "945331443435982868") {
        return true;
    }
    return false;
}
