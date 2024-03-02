const TelegramBot = require('node-telegram-bot-api');
const https = require('https');

// replace the value below with the Telegram token you receive from @BotFather
const token = '7148753151:AAGfnGuOsOD9_Ru-eI9bl_nCEEJrFZn89Kg';
const bot = new TelegramBot(token, { polling: true });

// Dictionary to store available commands and their descriptions
const availableCommands = {
    '/lion': 'Get LION price',
    '/vet': 'Get VET price',
    '/vtho': 'Get VTHO price',
    '/squad': 'Get SQUAD price',
    '/mvg': 'Get MVG price',
    '/yeet': 'Get YEET price',
    '/mva': 'Get MVA price',
    '/sha': 'Get SHA price',
    '/wov': 'Get WOV price',
    '/hai': 'Get HAI price',
    '/vex': 'Get VEX price',
    '/sht': 'Get SHT price',
};

// Dictionary to store user IDs who have received the welcome message
const welcomedUsers = {};

// Command to fetch LION price
bot.onText(/\/lion/, (msg) => {
    getPriceForToken('LION', '0x476C75cC7F264eb5960545Daa0B60be38487478E', msg);
});

// Command to fetch SHA price
bot.onText(/\/VET/, (msg) => {
    getPriceForToken('WVET', '0x6c33A10d32aC466c324F23A949cC3F4B70AF4513', msg);
});

// Command to fetch SHA price
bot.onText(/\/vtho/, (msg) => {
    getPriceForToken('VTHO', '0x2B6fC877fF5535b50f6C3e068BB436b16EC76fc5', msg);
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
bot.onText(/\/mva/, (msg) => {
    getPriceForToken('MVA', '0xF640DE49e50Ae442b17305D0dA59a523d45746Ee', msg);
});

// Command to fetch SHA price
bot.onText(/\/sha/, (msg) => {
    getPriceForToken('SHA', '0xa14A5bDD5AB3D51062c5B243a2e6Fb0949fee2F3', msg);
});

// Command to fetch SHA price
bot.onText(/\/wov/, (msg) => {
    getPriceForToken('WOV', '0xD86bed355d9d6A4c951e96755Dd0c3cf004d6CD0', msg);
});

// Command to fetch SHA price
bot.onText(/\/hai/, (msg) => {
    getPriceForToken('HAI', '0x2a0455D09c38c22824aD5225e0B56bD1D2D31561', msg);
});

// Command to fetch SHA price
bot.onText(/\/vex/, (msg) => {
    getPriceForToken('VEX', '0x39cd888a1583498AD30E716625AE1a00ff51286D', msg);
});

// Command to fetch SHA price
bot.onText(/\/sht/, (msg) => {
    getPriceForToken('SHT', '0x91B1ed544A5492974eD5e2CC319506Df77B18409', msg);
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