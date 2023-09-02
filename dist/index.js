"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const constants_1 = __importDefault(require("./constants"));
const functions_1 = require("./functions");
const UniswapPair__factory_1 = require("./types/ethers-contracts/factories/UniswapPair__factory");
const ethers_contracts_1 = require("./types/ethers-contracts");
const dextoolsToken = [];
constants_1.default.forEach(async (constant, index) => {
    const data = await (0, functions_1.getDextoolToken)(constant);
    if (data) {
        dextoolsToken[index] = data;
    }
    await setListeners(constant, index);
});
async function setListeners(constant, index) {
    let provider = new ethers_1.WebSocketProvider(constant.ws);
    let httpProvider = new ethers_1.JsonRpcProvider(constant.rpc);
    const pair = UniswapPair__factory_1.UniswapPair__factory.connect(constant.pair, provider);
    const token = ethers_contracts_1.Blazex__factory.connect(constant.tokenAddress, httpProvider);
    pair.on(pair.filters["Swap(address,uint256,uint256,uint256,uint256,address)"], async (sender, amount0In, amount1In, amount0Out, amount1Out, to, event) => {
        console.log(event);
        const data = await (0, functions_1.getDextoolToken)(constant);
        if (data) {
            dextoolsToken[index] = data;
        }
        if (amount0In > 0 && amount1Out > 0 && to !== constant.tokenAddress) {
            const marketCap = dextoolsToken[index].data.metrics.totalSupply * dextoolsToken[index].data.reprPair.price;
            const blazexAmount = ethers_1.ethers.formatUnits(amount1Out, 9);
            const ethAmount = ethers_1.ethers.formatEther(amount0In);
            const usdPrice = await (0, functions_1.getCurrencyPrice)(constant.priceApi);
            const usdAmount = Number(ethAmount) * Number(usdPrice);
            const truncatedAddress = `${to.slice(0, 6)}...${to.slice(-4)}`;
            const transactionHash = event.transactionHash;
            const nowBalance = await token.balanceOf(to);
            const previousBalance = nowBalance - amount1Out;
            const blazexPrice = (Number(ethAmount) / Number(blazexAmount)) * Number(usdPrice);
            let position = 0, newHolderString = "";
            if (previousBalance === 0n) {
                newHolderString = '*✅ New Holder*\n';
            }
            else {
                position = (Number(amount1Out) / Number(previousBalance)) * 100;
            }
            if (position > 1000) {
                position = 1000;
            }
            const baseMessage = (`*BlazeX Buy!*\n🔥\n\n` +
                `*💵 ${parseFloat(ethAmount).toFixed(4)} ${constant.currency} ($${(usdAmount).toFixed(2)})*\n` +
                `*🪙 ${parseFloat(blazexAmount).toFixed(0)} BlazeX*\n` +
                `🔸 [${truncatedAddress}](${constant.explorer}/address/${to}) | [Txn](${constant.explorer}/tx/${transactionHash})\n` +
                `*🔼 Position +${position.toFixed(2)}%*\n` +
                `*💲Price: ${blazexPrice.toFixed(8)}*\n` +
                `*Market Cap $${marketCap ? marketCap.toFixed(2) : "N/A"}\n\n*` +
                `${newHolderString}\n` +
                `*🔷 ETH BlazeX Price: ${(dextoolsToken[0].data.reprPair.price).toFixed(8)}*\n` +
                `*🔶 BSC BlazeX Price: ${(dextoolsToken[1].data.reprPair.price).toFixed(8)}*\n\n` +
                `*Contract:* \`${constant.tokenAddress}\`\n\n` +
                `🥇 [Chart](https://blazex.org)              ✨ [BlazeX Hub](https://T.me/BlazeXHub)\n` +
                `🤖 [Deployer](https://T.me/BlazeXDeployerBot)       ❌ [Twitter](https://Twitter.com/BlazeXCoin)`);
            (0, functions_1.sendTelegramMessage)(baseMessage);
        }
    });
    setTimeout(() => {
        provider.websocket.close();
        setListeners(constant, index);
    }, 60000);
}
