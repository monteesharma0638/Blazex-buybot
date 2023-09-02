export interface Chain {
    name: string,
    ws: `wss://${string}`,
    tokenAddress: `0x${string}`,
    pair: `0x${string}`,
    rpc: `https://${string}`,
    tokenDecimals: number,
    currency: string,
    priceApi: string,
    explorer: `https://${string}`,
    chartLink: string,
    weth: `0x${string}`,
    network: string,
    slug: string
}

const mainChains: Chain[] = [
    {
        name: "Ethereum Mainnet",
        currency: "ETH",
        ws: "wss://mainnet.infura.io/ws/v3/000b58b629a14ed698f42fd525d5c2d2",
        rpc: "https://mainnet.infura.io/v3/000b58b629a14ed698f42fd525d5c2d2",
        tokenAddress: "0xDD1b6B259986571A85dA82A84f461e1c212591c0",
        pair: "0x6c110c11238c5d3389eA3c480eb7f23a7BE909D9",
        tokenDecimals: 9,
        priceApi: "https://www.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
        explorer: "https://etherscan.io",
        chartLink: "https://www.dextools.io/app/en/ether/pair-explorer/0x6c110c11238c5d3389ea3c480eb7f23a7be909d9",
        weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        network: "ethereum",
        slug: "ether"
    },
    {
        name: "Binance smart chain",
        currency: "BNB",
        ws: "wss://rpc.ankr.com/bsc/ws/45f6aa88b8a64f23af9a1f23bdcf99322aab66cb807ba3e7c00dd79209c5c251",
        rpc: "https://rpc.ankr.com/bsc/45f6aa88b8a64f23af9a1f23bdcf99322aab66cb807ba3e7c00dd79209c5c251",
        tokenAddress: "0xDD1b6B259986571A85dA82A84f461e1c212591c0",
        pair: "0x0032CE6eBA91A996688aDDC0DCd56C691C7b613D",
        tokenDecimals: 9,
        priceApi: "https://www.binance.com/api/v3/ticker/price?symbol=BNBUSDT",
        explorer: "https://bscscan.com",
        chartLink: "https://www.dextools.io/app/en/bnb/pair-explorer/0x0032ce6eba91a996688addc0dcd56c691c7b613d",
        weth: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        network: "bsc",
        slug: "bsc"
    }
]

export default mainChains;