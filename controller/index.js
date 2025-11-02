const { handleMessage } = require("./lib/Telegram");

async function handler(req, res) {
    const {body} = req;
    if (body){
        const messageObj = body.message;
        await handleMessage(messageObj);
    }
}

module.exports = { handler };