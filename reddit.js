const axios = require("axios");

module.exports = {
    loadPage: (sub, message) => {
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
