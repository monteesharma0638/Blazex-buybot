"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDextoolToken = exports.getDextoolPair = exports.getTokenPrice = exports.get_token_price_and_marketcap = exports.getBinancePriceEth = exports.getBinancePriceBNB = exports.getCurrencyPrice = exports.sendTelegramMessage = exports.BASE_TELEGRAM_URL = exports.TELEGRAM_CHAT_ID = exports.TELEGRAM_TOKEN = void 0;
const axios_1 = __importDefault(require("axios"));
// Telegram settings
exports.TELEGRAM_TOKEN = '6427892218:AAEavoC3hfIzhaGJMSL3GkUUBMH0BvXfzVY';
exports.TELEGRAM_CHAT_ID = '-1001510752049';
exports.BASE_TELEGRAM_URL = `https://api.telegram.org/bot${exports.TELEGRAM_TOKEN}/sendMessage`;
async function sendTelegramMessage(message) {
    const data = {
        chat_id: exports.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
    };
    try {
        const response = await axios_1.default.post(exports.BASE_TELEGRAM_URL, data);
        return response.data;
    }
    catch (error) {
        console.error('Error sending Telegram message:', error);
        return null;
    }
}
exports.sendTelegramMessage = sendTelegramMessage;
async function getCurrencyPrice(URL) {
    try {
        const response = await axios_1.default.get(URL);
        if (response.status === 200) {
            const price = parseFloat(response.data.price);
            return price;
        }
        else {
            console.error('Error:', response.status);
            return null;
        }
    }
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}
exports.getCurrencyPrice = getCurrencyPrice;
async function getBinancePriceBNB() {
    const URL = 'https://www.binance.com/api/v3/ticker/price?symbol=BNBUSDT';
    try {
        const response = await axios_1.default.get(URL);
        if (response.status === 200) {
            const price = parseFloat(response.data.price);
            return price;
        }
        else {
            console.error('Error:', response.status);
            return null;
        }
    }
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}
exports.getBinancePriceBNB = getBinancePriceBNB;
async function getBinancePriceEth() {
    const URL = 'https://www.binance.com/api/v3/ticker/price?symbol=ETHUSDT';
    try {
        const response = await axios_1.default.get(URL);
        if (response.status === 200) {
            const price = parseFloat(response.data.price);
            return price;
        }
        else {
            console.error('Error:', response.status);
            return null;
        }
    }
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}
exports.getBinancePriceEth = getBinancePriceEth;
async function get_token_price_and_marketcap(token_id, vs_currency = 'usd') {
    const base_url = 'https://api.coingecko.com/api/v3/simple/price';
    const params = {
        ids: token_id,
        vs_currencies: vs_currency,
        include_market_cap: 'true',
    };
    try {
        const response = await axios_1.default.get(base_url, { params });
        const data = response.data;
        if (token_id in data) {
            return data[token_id];
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Error fetching token price and market cap:', error);
        return null;
    }
}
exports.get_token_price_and_marketcap = get_token_price_and_marketcap;
async function getTokenPrice(chain) {
    var axios = require('axios');
    var data = JSON.stringify({
        "query": `{\n  ethereum(network: ${chain.network}) {\n    dexTrades(\n      baseCurrency: {is: \"${chain.tokenAddress}\"}\n      quoteCurrency: {is: \"${chain.weth}\"}\n      options: {desc: [\"block.height\", \"transaction.index\"], limit: 1}\n    ) {\n      block {\n        height\n        timestamp {\n          time(format: \"%Y-%m-%d %H:%M:%S\")\n        }\n      }\n      transaction {\n        index\n      }\n      baseCurrency {\n        symbol\n      }\n      quoteCurrency {\n        symbol\n      }\n      quotePrice\n    }\n  }\n}\n`,
        "variables": "{}"
    });
    var config = {
        method: 'post',
        url: 'https://graphql.bitquery.io',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'BQYP7HLAbm2duwSOUvuxv09YxwuYlvvc'
        },
        data: data
    };
    axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
        .catch(function (error) {
        console.log(error);
    });
}
exports.getTokenPrice = getTokenPrice;
async function getDextoolPair(chain) {
    const axios = require('axios');
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.dextools.io/v1/pair?chain=${chain.slug}&address=${chain.pair}`,
        headers: {
            'accept': 'application/json',
            'X-API-Key': 'c9205c2858c3e300b1dd43a9eec361ef'
        }
    };
    const data = await axios.request(config)
        .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data;
    })
        .catch((error) => {
        console.log(error);
        return null;
    });
    return data;
}
exports.getDextoolPair = getDextoolPair;
async function getDextoolToken(chain) {
    const axios = require('axios');
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.dextools.io/v1/token?chain=${chain.slug}&address=${chain.tokenAddress}&page=0&pageSize=5`,
        headers: {
            'accept': 'application/json',
            'X-API-Key': 'c9205c2858c3e300b1dd43a9eec361ef'
        }
    };
    const data = axios.request(config)
        .then((response) => {
        console.log(JSON.stringify(response.data));
        if (response.data?.statusCode) {
            return response.data;
        }
        else {
            return null;
        }
    })
        .catch((error) => {
        console.log(error);
        return null;
    });
    return data;
}
exports.getDextoolToken = getDextoolToken;
