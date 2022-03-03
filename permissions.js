const Discord = require("discord.js");
const Embeds = require("./embeds.js");
const { allowRole, denyRole } = require("./SQLDataBase.js");

module.exports = {
    run: (message, words) => {
        if (
            !message.member.permissions.has(
                Discord.Permissions.FLAGS.ADMINISTRATOR
            )
        ) {
            return message.channel.send(
                "This command requires administrator permissions"
            );
        }
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
                allow(message, words);
                break;
            case "deny":
                deny(message, words);
                break;
            default:
                message.channel.send("Syntax Error");
                break;
        }
    },
};

function allow(message, words) {
    words = words.join(" ");
    role = getRole(message, words);
    if (role === undefined) {
        return message.channel.send("Invalid role");
    } else {
        allowRole(message, role.id.toLowerCase(), role.guild.id.toLowerCase());
    }
}

function deny(message, words) {
    words = words.join(" ");
    role = getRole(message, words);
    if (role === undefined) {
        return message.channel.send("Invalid role");
    } else {
        denyRole(message, role.id.toLowerCase(), role.guild.id.toLowerCase());
    }
}

function getRole(message, words) {
    let roleName = /^([a-z _-]+)$/;
    const matches = roleName.exec(words);
    if (matches !== null) {
        role = message.channel.guild.roles.cache.find(
            (role) => role.name.toLowerCase() === words
        );
        return role;
    }
    let roleId = /^([0-9]+)$/;
    const matches2 = roleId.exec(words);
    if (matches2 !== null) {
        role = message.channel.guild.roles.cache.find(
            (role) => role.id.toLowerCase() === words
        );
        return role;
    }
    return undefined;
}
