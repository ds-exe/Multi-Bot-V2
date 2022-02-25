const timezones = require("./timezones.json");
const Discord = require("discord.js");
const { DateTime } = require("luxon");

const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const embedMessage = new Discord.MessageEmbed()
    .setColor("#00FFFF")
    .setTitle("Local time:")
    .setDescription(`<t:0:F>`);

module.exports = {
    generateTimestamp: (channel, words) => {
        errored = false;
        offset = 0;
        if (words[1] === undefined || words[1] === "help") {
            channel.send(
                "Valid inputs: \nTime in form: `hh:mm`\nDate in form: `dd/mm` or `dd/mm/yyyy`\nOptional timezone specifier: `UTC{+/-}hh` or abbreviation"
            );
            return;
        }
        words.shift();
        let date = DateTime.utc();
        date = date.set({ hour: 0, minute: 0, second: 0 });
        for (let word of words) {
            let success = false;
            dateModifiers.forEach((mod) => {
                vals = mod(word, date, success);
                date = vals[0];
                success = vals[1];
            });
            if (!success) {
                channel.send(
                    "Not following valid formats: \nTime in form: `hh:mm`\nDate in form: `dd/mm` or `dd/mm/yyyy`\nOptional timezone specifier: `UTC{+/-}hh` or abbreviation"
                );
                return;
            }
        }
        let unixTime = parseInt(date.toSeconds());
        embedMessage.setDescription(`<t:${unixTime}:F>`);
        embedMessage.fields = [];
        embedMessage.addFields({
            name: `Copy Link:`,
            value: `\\<t:${unixTime}:F>`,
        });
        channel.send(embedMessage);
    },
};

const dateModifiers = [parseDate, parseTime, setTimezone];

function setTimezone(word, date, success) {
    zonesRegex = /^([a-z]+)$/;
    const zoneMatches = zonesRegex.exec(word);
    if (zoneMatches !== null) {
        const zone = zoneMatch(zoneMatches[1]);
        if (zone !== null) {
            success = true;
            date = date.setZone(zone, { keepLocalTime: true });
            return [date, success];
        }
    }
    timezoneRegex = /^(utc[+-]{1}[0-9]{1,2})$/;
    if (word.indexOf("+") === -1 && word.indexOf("-") === -1) {
        return [date, success];
    }
    const matches = timezoneRegex.exec(word);
    if (matches === null) {
        return [date, success]; // error does not match
    }
    const zone = matches[1].toUpperCase();
    success = true;
    date = date.setZone(zone, { keepLocalTime: true });
    return [date, success];
}

function parseTime(word, date, success) {
    timeRegex = /^([0-9]{1,2}):([0-9]{2})$/;
    if (word.indexOf(":") === -1) {
        return [date, success];
    }
    const matches = timeRegex.exec(word);
    if (matches === null) {
        return [date, success]; // error does not match
    }
    const hours = matches[1];
    const minutes = matches[2];
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        success = true;
        date = date.set({ hour: hours, minute: minutes });
    }
    return [date, success];
}

function parseDate(word, date, success) {
    dateRegex = /^([0-9]{1,2})\/([0-9]{1,2})\/?([0-9]{4})?$/;
    if (word.indexOf("/") === -1) {
        return [date, success];
    }
    const matches = dateRegex.exec(word);
    if (matches === null) {
        return [date, success]; // error does not match
    }
    const day = matches[1];
    const month = matches[2];
    const year = matches[3];
    if (
        day >= 1 &&
        day <= monthLength(month, year) &&
        month >= 1 &&
        month <= 12
    ) {
        if (year !== undefined) {
            date = date.set({ year: year });
        }
        success = true;
        date = date.set({ day: day, month: month });
    }
    return [date, success];
}

function zoneMatch(zone) {
    if (zone in timezones) {
        return timezones[zone];
    }
    return null;
}

function monthLength(month, year) {
    if (month == 2) {
        if (leapYear(year)) {
            return 29;
        }
    }
    return monthLengths[month - 1];
}

function leapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}
