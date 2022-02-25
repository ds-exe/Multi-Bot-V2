const config = require("./config.json");
const Discord = require("discord.js");
const Timestamp = require("./timestamp.js");
const Reddit = require("./reddit.js");
const Music = require("./music");
const client = new Discord.Client();

const token = config.token;
const prefix = config.prefix;
const botOwner = config.owner;

client.on("ready", () => {
    console.log("Connected as " + client.user.tag);
    //Setting activity: "Now listening to !help"
    client.user.setActivity("!help", { type: "LISTENING" });
});

client.on("message", (message) => {
    if (message.content.startsWith(prefix) && !message.author.bot) {
        next(message);
    }
});

async function next(message) {
    let isBotOwner = message.author.id === botOwner;
    let targetChannel = client.channels.cache.get(message.channel.id);
    msg = message.content;
    msg = msg.replace(`${prefix}`, "").toLowerCase();
    words = msg.split(" ");

    let commands = /^([a-z]+)$/;
    const matches = commands.exec(words[0]);
    if (matches === null) {
        return message.channel.send("Invalid command");
    }
    let command = matches[1];
    switch (command) {
        case "time":
        case "date":
            Timestamp.generateTimestamp(targetChannel, words);
            break;
        case "timezone":
            break;
        case "reddit":
            Reddit.loadPage(words, message);
            break;
        case "play":
            Music.run(command, message, client);
            break;
        case "skip":
            Music.run(command, message, client);
            break;
        case "stop":
            Music.run(command, message, client);
            break;
        case "quit":
            if (isBotOwner) {
                message.channel.send("Shutting down").then((m) => {
                    client.destroy();
                    process.exit(1);
                });
            } else {
                targetChannel.send("Error only available to bot owner");
            }
            break;
        case "help":
            targetChannel.send(
                "Available commands:\n!time or !date\n!reddit" +
                    "\n!play\n!skip\n!stop"
            );
            break;
        default:
            targetChannel.send("Syntax Error");
            break;
    }
}

client.on("error", console.error);
client.login(token);
