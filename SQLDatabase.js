const sqlite3 = require("sqlite3").verbose();
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

    setTimezone: (userID, timezone) => {
        timezoneRegex = /^(utc[+-]{1}[0-9]{1,2})$/;
        const matches = timezoneRegex.exec(timezone);
        if (matches === null) {
            return; // error does not match
        }
        db.run(
            `REPLACE INTO timezones (userID, timezone) VALUES ('${userID}', '${timezone.toUpperCase()}')`
        );
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
                    resolve("utc+0");
                }
            });
        });
    },

    createDataBase: (name) => {
        new sqlite3.Database(`${name}.db`);
        console.log(`successfully created new database called ${name}`);
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
    },
};
