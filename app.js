const TelegramBot = require('node-telegram-bot-api');
const https = require('https');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6548876844:AAEdEGFAztjrmFq3W4WW7lD8ZvJJJf5-z5c';
const bot = new TelegramBot(token, { polling: true });

// Dictionary to store available commands and their descriptions
const availableCommands = {
    '/lion': 'Get LION price',
    '/squad': 'Get SQUAD price',
    '/mvg': 'Get MVG price',
    '/yeet': 'Get YEET price',
    '/sha': 'Get SHA price',
    '/vtho': 'Get VTHO price',
    '/wov': 'Get WOV price',
    '/hai': 'Get HAI price',
    '/vex': 'Get VEX price',
};

// Dictionary to store user IDs who have received the welcome message
const welcomedUsers = {};

// Command to fetch LION price
bot.onText(/\/lion/, (msg) => {
    getPriceForToken('LION', '0x476C75cC7F264eb5960545Daa0B60be38487478E', msg);
});

// Command to fetch SHA price
bot.onText(/\/squad/, (msg) => {
    getPriceForToken('SQUAD', '0xb3E3eD92334b52b1Bf0E48d6D07BA4b7822081e5', msg);
});

// Command to fetch SHA price
bot.onText(/\/mvg/, (msg) => {
    getPriceForToken('MVG', '0xa051Db301625039C0d5fd9a1F5A41fc57fE5a709', msg);
});

// Command to fetch SHA price
bot.onText(/\/yeet/, (msg) => {
    getPriceForToken('YEET', '0x516eCA119f673f6747c81189Bef4F14367c0c2B7', msg);
});

// Command to fetch SHA price
bot.onText(/\/sha/, (msg) => {
    getPriceForToken('SHA', '0xa14A5bDD5AB3D51062c5B243a2e6Fb0949fee2F3', msg);
});

// Command to fetch SHA price
bot.onText(/\/vtho/, (msg) => {
    getPriceForToken('VTHO', '0x2B6fC877fF5535b50f6C3e068BB436b16EC76fc5', msg);
});

// Command to fetch SHA price
bot.onText(/\/wov/, (msg) => {
    getPriceForToken('WOV', '0x226585F8FB83690b65b58A48571B74fb358f7663', msg);
});

// Command to fetch SHA price
bot.onText(/\/hai/, (msg) => {
    getPriceForToken('HAI', '0x2a0455D09c38c22824aD5225e0B56bD1D2D31561', msg);
});
// Command to fetch SHA price
bot.onText(/\/mvg/, (msg) => {
    getPriceForToken('MVG', '0xa051Db301625039C0d5fd9a1F5A41fc57fE5a709', msg);
});
// Command to fetch SHA price
bot.onText(/\/vex/, (msg) => {
    getPriceForToken('VEX', '0xa0346DCDa7293970d18Ef2885f8fcb369F91F1Dc', msg);
});

// Function to fetch price for a token
function getPriceForToken(tokenName, pairAddress, msg) {
    const chatId = msg.chat.id;

    https.get(`https://api.vexchange.io/v1/pairs/${pairAddress}`, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`${tokenName} data:`, data); // Log data received for token

            try {
                const pairData = JSON.parse(data);

                // Verify that the API response contains the required fields for the token
                if (pairData && pairData.token0 && pairData.token0.usdPrice) {
                    const tokenPrice = pairData.token0.usdPrice.toFixed(8); // Round to 8 decimal places
                    bot.sendMessage(chatId, `${tokenName} Price: $${tokenPrice}`);
                } else {
                    bot.sendMessage(chatId, `Unable to fetch ${tokenName} price.`);
                }
            } catch (error) {
                console.error(`Error parsing ${tokenName} pair data:`, error);
                bot.sendMessage(chatId, `An error occurred while parsing data for ${tokenName} token.`);
            }
        });
    }).on('error', (error) => {
        console.error(`Error fetching ${tokenName} pair data:`, error);
        bot.sendMessage(chatId, `An error occurred while fetching data for ${tokenName} token.`);
    });
}

// Command to show available commands
bot.onText(/\/commands/, (msg) => {
    const chatId = msg.chat.id;
    let commandsText = '*Available commands:*\n';
    for (const command in availableCommands) {
        commandsText += `${command} - ${availableCommands[command]}\n`;
    }
    bot.sendMessage(chatId, commandsText, { parse_mode: "Markdown" });
});

// Event listener for new users
bot.on('new_chat_members', (msg) => {
    const chatId = msg.chat.id;
    const newMembers = msg.new_chat_members;

    newMembers.forEach((member) => {
        const userId = member.id;
        if (!welcomedUsers[userId]) {
            bot.sendMessage(chatId, `Welcome to the group, ${member.first_name}!`);
            welcomedUsers[userId] = true;
        }
    });
});

console.log("Bot is running.");