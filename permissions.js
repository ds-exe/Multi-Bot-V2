const timezones = require("./timezones.json");
const { DateTime } = require("luxon");
const Embeds = require("./embeds.js");
const { getTimezone } = require("./SQLDataBase.js");

// //console.log(message.author);
// console.log(
//     message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)
// );
// console.log(message.channel.guild.roles);
// bob = message.channel.guild.roles.cache.find(
//     (role) => role.name.toLowerCase() === `${rolehere}`
// );
// if (bob === undefined) {
//     //do x
// }
// //console.log(message.member.roles.cache);
// //message.channel.guild.serverOwner

module.exports = {
    run: (message, words) => {
        let commands = /^([a-z]+)$/;
        const matches = commands.exec(words[0]);
        if (matches === null) {
            return message.channel.send("Invalid command");
        }
        let command = matches[1];
        words.shift();
        switch (command) {
            case "help":
                break;
            case "allow":
                break;
            case "deny":
                break;
            default:
                targetChannel.send("Syntax Error");
                break;
        }
    },
};
