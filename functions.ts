import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { Chain } from "./constants";

// Telegram settings
export const TELEGRAM_TOKEN = '6427892218:AAEavoC3hfIzhaGJMSL3GkUUBMH0BvXfzVY';
export const TELEGRAM_CHAT_ID = '-1001510752049';
export const BASE_TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

export async function sendTelegramMessage(message: string) {
    const data = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
    };

    try {
        const response = await axios.post(BASE_TELEGRAM_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        return null;
    }
}

sendTelegramMessageWithPhoto("some test message with photo");

export async function sendTelegramMessageWithPhoto(message: string) {
    const telegramBotToken = TELEGRAM_TOKEN;
    const chatId = TELEGRAM_CHAT_ID;

    const url = `https://api.telegram.org/bot${telegramBotToken}/sendPhoto`;
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('caption', message);
    formData.append('photo', "https://i.ibb.co/QCHy3hD/IMG-0468.jpg");

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    const responseData = await response.json();
    console.log('Message sent:', responseData);
    
}


export async function getCurrencyPrice(URL: string) {

    try {
        const response = await axios.get(URL);
        if (response.status === 200) {
            const price = parseFloat(response.data.price);
            return price;
        } else {
            console.error('Error:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getBinancePriceBNB() {
    const URL = 'https://www.binance.com/api/v3/ticker/price?symbol=BNBUSDT';

    try {
        const response = await axios.get(URL);
        if (response.status === 200) {
            const price = parseFloat(response.data.price);
            return price;
        } else {
            console.error('Error:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getBinancePriceEth() {
    const URL = 'https://www.binance.com/api/v3/ticker/price?symbol=ETHUSDT';

    try {
        const response = await axios.get(URL);
        if (response.status === 200) {
            const price = parseFloat(response.data.price);
            return price;
        } else {
            console.error('Error:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export async function get_token_price_and_marketcap(token_id: string, vs_currency = 'usd') {
    const base_url = 'https://api.coingecko.com/api/v3/simple/price';

    const params = {
        ids: token_id,
        vs_currencies: vs_currency,
        include_market_cap: 'true',
    };

    try {
        const response = await axios.get(base_url, { params });
        const data = response.data;

        if (token_id in data) {
            return data[token_id];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching token price and market cap:', error);
        return null;
    }
}

export async function getTokenPrice(chain: Chain) {
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
        .then(function (response: any) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error: any) {
            console.log(error);
        });
}


export async function getDextoolPair(chain: Chain) {
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

    const data: DextoolResult | null = await axios.request(config)
        .then((response: AxiosResponse) => {
            console.log(JSON.stringify(response.data));
            return response.data;
        })
        .catch((error: AxiosError) => {
            console.log(error);
            return null;
        });

    return data;
}


export async function getDextoolToken(chain: Chain) {
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

    const data: DextoolsToken | null = axios.request(config)
        .then((response: AxiosResponse) => {
            console.log(JSON.stringify(response.data));
            if(response.data?.statusCode){
                return response.data;
            }
            else {
                return null;
            }
        })
        .catch((error: AxiosError) => {
            console.log(error);
            return null;
        });

    return data;
}



// interfaces

export interface DextoolsToken {
    statusCode: number;
    data: {
      audit: {
        is_contract_renounced: boolean;
        codeVerified: boolean;
        date: string;
        lockTransactions: boolean;
        mint: boolean;
        provider: string;
        proxy: boolean;
        status: string;
        unlimitedFees: boolean;
        version: number;
      };
      decimals: number;
      info: {
        description: string;
        email: string;
        extraInfo: string;
        nftCollection: string;
        ventures: boolean;
      };
      links: {
        bitbucket: string;
        discord: string;
        facebook: string;
        github: string;
        instagram: string;
        linkedin: string;
        medium: string;
        reddit: string;
        telegram: string;
        tiktok: string;
        twitter: string;
        website: string;
        youtube: string;
      };
      logo: string;
      metrics: {
        maxSupply: number;
        totalSupply: number;
        txCount: number;
        holders: number;
      };
      name: string;
      symbol: string;
      totalSupply: string;
      reprPair: {
        id: {
          chain: string;
          exchange: string;
          pair: string;
          token: string;
          tokenRef: string;
        };
        price: number;
      };
      creationBlock: number;
      pairs: {
        address: string;
        exchange: string;
        dextScore: number;
        price: number;
        tokenRef: {
          address: string;
          name: string;
          symbol: string;
        };
      }[];
      chain: string;
      address: string;
    };
  }

  
export interface DextoolResult {
    id: {
        chain: string,
        exchange: string,
        pair: string,
        token: string,
        tokenRef: string
    },
    creationBlock: number,
    symbol: string,
    name: string,
    symbolRef: string,
    nameRef: string,
    type: string,
    metrics: {
        reserve: number,
        reserveRef: number,
        liquidity: number
    },
    dextScore: {
        total: number
    }
}
  