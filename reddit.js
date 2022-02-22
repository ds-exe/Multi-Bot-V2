const axios = require("axios");

module.exports = {
    loadPage: (sub, message) => {
        if (
            !message.member.roles.cache.has("379325076740374528") &&
            !message.member.roles.cache.has("279437266491801602") &&
            !message.member.roles.cache.has("945331443435982868")
        ) {
            return message.channel.send(
                "You do not have permission to use this command!"
            );
        }
        axios
            .get(
                `https://www.reddit.com/r/${sub}.json?limit=100&?sort=top&t=all`
            )
            .then((response) =>
                response.data.data.children.map((v) => v.data.url)
            )
            .then((urls) => postPage(urls, message));
    },
};

function postPage(urls, message) {
    const randomURL = urls[Math.floor(Math.random() * urls.length) + 1];
    if (randomURL !== undefined) {
        message.channel.send(randomURL);
    } else {
        message.channel.send("Sub-Reddit not found");
    }
}
