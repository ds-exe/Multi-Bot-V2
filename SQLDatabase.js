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
        //printDataBase();
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
