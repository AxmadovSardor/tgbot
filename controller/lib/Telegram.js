const { getAIResponse } = require("./ai");
const { axiosInstance } = require("./axios");

function sendMessages(messageObj, messageText) {
    // Telegram's chat id is usually at message.chat.id
    const chatId = (messageObj && messageObj.chat && messageObj.chat.id) || messageObj.chat_id || (messageObj.from && messageObj.from.id);
    if (!chatId) return Promise.reject(new Error("Missing chat id in update message object"));

    return axiosInstance.get("sendMessage", {
        chat_id: chatId,
        text: messageText,
    });
}

async function handleMessage(messageObj) {
    if (!messageObj) return;
    const messageText = messageObj.text || "";

    // Commands start with slash at position 0
    if (messageText.startsWith("/")) {
        const command = messageText.substr(1).split(" ")[0];
        console.log("Received command:", command);
        switch (command) {
            case "start":
                return sendMessages(messageObj, "Welcome to the Assistant bot of Karshi Presidential school!");
            case "help":
                return sendMessages(messageObj, "Available commands: /start, /help");
            default:
                return sendMessages(messageObj, `Unknown command: ${command}`);
        }
    } else {
        // Call the AI backend, then send its response to the same chat.
        // Await the AI response (safe if AI backend is unavailable it will return a message)
        try {
            const aiText = await getAIResponse(messageText);
            return sendMessages(messageObj, aiText || "");
        } catch (err) {
            console.error("AI handler error:", err);
            // Fallback message to the user
            return sendMessages(messageObj, "Sorry, I couldn't process that right now.");
        }
    }
}

module.exports = { handleMessage };