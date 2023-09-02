import { WebSocketProvider, ethers, JsonRpcProvider } from "ethers";
import constants, { Chain } from "./constants";
import { DextoolsToken, getCurrencyPrice, getDextoolToken, sendTelegramMessageWithPhoto } from "./functions";
import { UniswapPair__factory } from "./types/ethers-contracts/factories/UniswapPair__factory";
import { Blazex__factory } from "./types/ethers-contracts";

const dextoolsToken: DextoolsToken[] = [];

constants.forEach(async (constant, index) => {
    const data = await getDextoolToken(constant);
    if (data) {
        dextoolsToken[index] = data;
    }
    await setListeners(constant, index);
})


async function setListeners(constant: Chain, index: number) {
    let provider = new WebSocketProvider(constant.ws);
    let httpProvider = new JsonRpcProvider(constant.rpc);

    const pair = UniswapPair__factory.connect(constant.pair, provider);
    const token = Blazex__factory.connect(constant.tokenAddress, httpProvider);

    pair.on(pair.filters["Swap(address,uint256,uint256,uint256,uint256,address)"], async (sender, amount0In, amount1In, amount0Out, amount1Out, to, event: unknown) => {
        console.log(event);
        const data = await getDextoolToken(constant);
        if (data) {
            dextoolsToken[index] = data;
        }


        if (amount0In > 0 && amount1Out > 0 && to !== constant.tokenAddress) {
            const marketCap = dextoolsToken[index].data.metrics.totalSupply * dextoolsToken[index].data.reprPair.price;
            const blazexAmount = ethers.formatUnits(amount1Out, constant.tokenDecimals);
            const ethAmount = ethers.formatEther(amount0In);
            const usdPrice = await getCurrencyPrice(constant.priceApi)
            const usdAmount = Number(ethAmount) * Number(usdPrice);
            const truncatedAddress = `${to.slice(0, 6)}...${to.slice(-4)}`;
            const transactionHash = (event as ethers.ContractEventPayload).log.transactionHash;
            const nowBalance = await token.balanceOf(to);
            const previousBalance = Number(ethers.formatUnits(nowBalance, constant.tokenDecimals)) - Number(ethers.formatUnits(amount1Out, constant.tokenDecimals));

            const blazexPrice = (Number(ethAmount) / Number(blazexAmount)) * Number(usdPrice);


            let position = 0, newHolderString = "";
            if (previousBalance <= 0n) {
                newHolderString = '*✅ New Holder*\n';
                position = 100;
            } else {
                position = (Number(nowBalance) / Number(previousBalance)) * 100;
            }
            if (position > 1000) {
                position = 1000;
            }

            let emojis: string = "";
            for (let i: number = 0; i < usdAmount / 25; i++) {
                if (index === 1) {
                    emojis += "🔥";
                }
                else {
                    emojis += "🤖";
                }
            }

            const baseMessage = (
                `*BlazeX Buy!*\n${emojis}\n\n` +
                `*💵 ${parseFloat(ethAmount).toFixed(4)} ${constant.currency} ($${(usdAmount).toFixed(2)})*\n` +
                `*🪙 ${parseFloat(blazexAmount).toFixed(0)} BlazeX*\n` +
                `${index ? "🔸" : "🔹"} [${truncatedAddress}](${constant.explorer}/address/${to}) | [Txn](${constant.explorer}/tx/${transactionHash})\n` +
                `*🔼 Position +${position.toFixed(2)}%*\n` +
                `*💲Price: ${blazexPrice.toFixed(8)}*\n` +
                `*Market Cap $${marketCap ? marketCap.toFixed(2) : "N/A"}\n\n*` +
                `${newHolderString}\n` +
                `*🔷 ETH BlazeX Price: ${(dextoolsToken[0].data.reprPair.price).toFixed(8)}*\n` +
                `*🔶 BSC BlazeX Price: ${(dextoolsToken[1].data.reprPair.price).toFixed(8)}*\n\n` +
                `*Contract:* \`${constant.tokenAddress}\`\n\n` +
                `🥇 [Chart](${index === 0 ? "https://www.dextools.io/app/en/ether/pair-explorer/0x6c110c11238c5d3389ea3c480eb7f23a7be909d9" : "https://www.dextools.io/app/en/bnb/pair-explorer/0x0032ce6eba91a996688addc0dcd56c691c7b613d"})              ✨ [BlazeX Hub](https://T.me/BlazeXHub)\n` +
                `🤖 [Deployer](https://T.me/BlazeXDeployerBot)       ❌ [Twitter](https://Twitter.com/BlazeXCoin)`
            );

            await sendTelegramMessageWithPhoto(baseMessage);
        }
    })


    setTimeout(() => {
        provider.websocket.close();
        setListeners(constant, index);
    }, 180000);
}