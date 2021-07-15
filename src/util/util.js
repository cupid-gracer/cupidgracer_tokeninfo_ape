import  { default as Web3 }  from "web3";
import axios from "axios";
import jsdom from "jsdom";
import got from "got";
import moment from "moment";
import {
        ISATokenAddress, 
        BNBTokenAddress, 
        BUSDTokenAddress, 
        USDTTokenAddress, 
        LPAddressV1, 
        LPAddressV2, 
        PancakeFactoryV1, 
        PancakeFactoryV2, 
        BSCscanApikey, 
        ISAAbi, 
        ERC20Abi, 
        PancakeFactoryAbi, 
        BNBPriceURL,
        axios_link,
        axios_bitquery_header,    
        test_header,
    } from "../constants/constant.js";

const { JSDOM } = jsdom;

class Util
{
    constructor()
    {
        console.log("util constructor");
        this.web3 = new Web3('https://bsc-dataseed1.binance.org:443');
        this.decimals = 10 ** 8;
        this.ISAcontract = new this.web3.eth.Contract(ISAAbi, ISATokenAddress);
        this.BNBContract = new this.web3.eth.Contract(ERC20Abi, BNBTokenAddress);
        this.BUSDContract = new this.web3.eth.Contract(ERC20Abi, BUSDTokenAddress);
        this.USDTContract = new this.web3.eth.Contract(ERC20Abi, USDTTokenAddress);
        this.PFV1 = new this.web3.eth.Contract(PancakeFactoryAbi, PancakeFactoryV1);
        this.PFV2 = new this.web3.eth.Contract(PancakeFactoryAbi, PancakeFactoryV2);
    }

    axiosGetOperation = function (link, query, header) {
        return new Promise(function (resolve, reject) {
            axios.get(link,"", {header: header}).then(res => {
                resolve(res)
                console.log("done: ", res);
            }).catch(err => {
                reject(err)
                console.log("err: ", err);
            })
        });
    }

    axiosPostOperation = function (link, query, header) {
        return new Promise(function (resolve, reject) {
            axios.post(link, JSON.stringify({ query }), header).then(res => {
                resolve(res)
                // console.log("done: ", res);
            }).catch(err => {
                reject(err)
                console.log("err: ", err);
            })
        });
    }

    getAgoTime = function (txSecTime)
    {
        const dateToTime = date => date.toLocaleString();
        var now = new Date();
        let nowSecTime = Math.round(now.getTime() / 1000);
        let diffSecTime = nowSecTime - txSecTime;
        if(diffSecTime < 60)
        {
            return diffSecTime + " secs ago";
        }
        else if(diffSecTime < 3600)
        {
            return Math.round(diffSecTime / 60) + " mins ago";
        }
        else if(diffSecTime < 86400)
        {
            let hrs = Math.trunc(diffSecTime / 3600);
            let mins = Math.trunc((diffSecTime % 3600) / 60);
            mins = mins == 0 ? "" : mins + " mins";
            return hrs + " hrs " + mins + " ago";
        }
        else
        {
            let days = Math.trunc(diffSecTime / 86400);
            let hrs = Math.trunc((diffSecTime % 86400) / 3600); 
            hrs = hrs == 0 ? "" : hrs + " hrs";
            return days + " days " + hrs + " ago";
        }
    }

    async getCurrentPrice() {
        let total = await this.ISAcontract.methods.totalSupply().call();
        let isaBalance = await this.ISAcontract.methods.balanceOf(LPAddressV2).call();
        let bnbBalance = await this.BNBContract.methods.balanceOf(LPAddressV2).call();
        let response = await fetch(BNBPriceURL).then((response) => { return response.json() });
        // let price = bnbBalance / isaBalance * (response.result.ethusd * 0.996016) / 10000000000;
        let price = bnbBalance / isaBalance * (response.result.ethusd * 0.996016) / 10000000000;

        let obj = { price: price };
        this.cache.set('price', obj, 5);

        return total;
    }

    async getTotalSupply(tokenAddress)
    {
        try{
            var contract = new this.web3.eth.Contract(ERC20Abi, tokenAddress); 
            let total = await contract.methods.totalSupply().call();
            let decimal = await contract.methods.decimals().call();
            let totalSupply =( total / 10 ** decimal);
            let TokenPrice = (await this.getTokenPrice(tokenAddress)).price;
            let burntNum =  await this.getBurntLPNum(tokenAddress);
            let marketCap = "$" + Math.trunc(TokenPrice * (totalSupply - burntNum)).toLocaleString();
            let ts = totalSupply;

            const checksumAddress = Web3.utils.toChecksumAddress(tokenAddress);
            console.log("checksumAddress:", checksumAddress);

            totalSupply = Math.trunc(totalSupply).toLocaleString();
            return {totalSupply:totalSupply, marketCap: marketCap, burntNum: burntNum, total: ts};
        }catch(e)
        {
            console.log("error", e);
        }
    }

    async getMarketCap(totalSupply, burntNum, tokenAddress)
    {
        let TokenPrice = (await this.getTokenPrice(tokenAddress)).price;
        let marketCap = "$" + Math.trunc(TokenPrice * (totalSupply - burntNum)).toLocaleString();
        return marketCap;
    }

    async getTokenName(tokenAddress)
    {
        let symbol = (await this.getTokenPrice(tokenAddress)).symbol;
        let name = (await this.getTokenPrice(tokenAddress)).name;

        return {name:name, symbol:symbol};
    }

    async getLPTokenList(tokenAddress)
    {
        let lp1 = await this.getLPtokenInfo(tokenAddress, BNBTokenAddress,  this.PFV2, this.BNBContract, true);
        let lp2 = await this.getLPtokenInfo(tokenAddress, BNBTokenAddress,  this.PFV1, this.BNBContract, false);
        let lp3 = await this.getLPtokenInfo(tokenAddress, BUSDTokenAddress, this.PFV2, this.BUSDContract, true);
        let lp4 = await this.getLPtokenInfo(tokenAddress, BUSDTokenAddress, this.PFV1, this.BUSDContract, false);
        let lp5 = await this.getLPtokenInfo(tokenAddress, USDTTokenAddress, this.PFV2, this.USDTContract, true);
        let lp6 = await this.getLPtokenInfo(tokenAddress, USDTTokenAddress, this.PFV1, this.USDTContract, false);
        let data = [lp1, lp2, lp3, lp4, lp5, lp6];
        const items = [];
        data.map((lp) => {
            if(lp.status == "success" && lp.tokenBalance != 0)
                items.push(lp);
        });
        return items;
    }

    /**
     * fromTokenAddress: Base Token Address
     * toTokenAddress: Quote Token Address
     * PFV: Pancake Factory V1/V2
     * 
     */
    async getLPtokenInfo(fromTokenAddress, toTokenAddress, PFV, pairContract, isV2)
    {
        try{
            let pairTokenAddress = await PFV.methods.getPair(fromTokenAddress, toTokenAddress).call();
            var contract = new this.web3.eth.Contract(ERC20Abi, fromTokenAddress);
            let fromSymbol = await contract.methods.symbol().call();
            let lp_balance = await contract.methods.balanceOf(pairTokenAddress).call();
            let decimal1 = await contract.methods.decimals().call();
            lp_balance = Math.round( lp_balance / 10 ** decimal1);
            
            let pairBalance = await pairContract.methods.balanceOf(pairTokenAddress).call();
            let toSymbol = await pairContract.methods.symbol().call();
            let pairTokenPrice = await fetch("https://api.pancakeswap.info/api/v2/tokens/" + toTokenAddress).then((response) => { return response.json() });
            // let bnbPrice = await fetch(BNBPriceURL).then((response) => { return response.json() });
            let decimal2 = await pairContract.methods.decimals().call();
            pairBalance = ( pairBalance / 10 ** decimal2 );
            let lp_price = "$" + Math.trunc(pairBalance * pairTokenPrice.data.price).toLocaleString();
            pairBalance = (pairBalance.toFixed(2) * 1).toLocaleString();
            
            return  {
                        status: "success",
                        fromSymbol:fromSymbol,
                        toSymbol:toSymbol, 
                        pv2: isV2, 
                        tokenBalance: lp_balance, 
                        pairBalance: pairBalance, 
                        price: lp_price,
                        toTokenAddress:toTokenAddress,
                        pairTokenAddress:pairTokenAddress,
                    };
        }catch(e)
        {
            return {status: "failed"};
        }

    }

    async getBurntLPNum(tokenAddress)
    {
        let axios_query =   `{
                                ethereum(network: bsc) {
                                    address(address: {is: "0x000000000000000000000000000000000000dead"}) {
                                        balances(currency: {is: "${tokenAddress}"}) {
                                            currency {
                                                address
                                                symbol
                                                tokenType
                                            }
                                            value
                                        }
                                    }
                                }
                            }`;
        
        return await this.axiosPostOperation(axios_link, axios_query, axios_bitquery_header).then(axios_res => {
            return axios_res.data.data.ethereum.address[0].balances[0].value;
        }).catch(axios_res_err => {
            return 0;
        });
    }

    async getTokenPrice(tokenAddress)
    {
        let axios_query =   `{
                                ethereum(network: bsc) {
                                    dexTrades(
                                    baseCurrency: {is: "${tokenAddress}"}
                                    quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
                                    options: {desc: ["block.height", "transaction.index"], limit: 1}
                                    ) {
                                    block {
                                        height
                                        timestamp {
                                        time(format: "%Y-%m-%d %H:%M:%S")
                                        }
                                    }
                                    transaction {
                                        index
                                    }
                                    baseCurrency {
                                        name
                                        symbol
                                        decimals
                                    }
                                    quoteCurrency {
                                        symbol
                                    }
                                    quotePrice
                                    }
                                }
                            }`;
        let bnbPrice = await fetch(BNBPriceURL).then((response) => { return response.json() });
        bnbPrice = bnbPrice.result.ethusd;
        return await this.axiosPostOperation(axios_link, axios_query, axios_bitquery_header).then(axios_res => {
            return {
                    price: axios_res.data.data.ethereum.dexTrades[0].quotePrice * bnbPrice, 
                    symbol: axios_res.data.data.ethereum.dexTrades[0].baseCurrency.symbol,
                    name: axios_res.data.data.ethereum.dexTrades[0].baseCurrency.name,
                    decimals: axios_res.data.data.ethereum.dexTrades[0].baseCurrency.decimals,
                };
        }).catch(axios_res_err => {
            console.error("axios_res_err", axios_res_err);
            return 0;
        });
    }

    async getTokenPriceFromPancake(tokenAddress)
    {
        let response = await fetch("https://api.pancakeswap.info/api/v2/tokens/"+ tokenAddress).then((response) => { return response.json() });
        let price = response.data.price;
        return price === undefined? 0 : price;
    }
    
    async checkAddress(tokenAddress) {
        return Web3.utils.isAddress(tokenAddress);
    }

    async getLast50Transactions(tokenAddress)
    {
        let axios_query = `{
            ethereum(network: bsc) {
                dexTrades(
                    baseCurrency: {is: "${tokenAddress}"}
                    options: {desc: "block.height", limit: 100}
                ) {
                    block {
                        height
                        timestamp {
                            time(format: "%H:%M:%S")
                            unixtime
                        }
                    }
                    transaction {
                        hash
                        txFrom{
                            address
                        }
                        to{
                            address
                        }
                    }
                    sellCurrency {
                        symbol
                        address
                    }
                    buyCurrency {
                        symbol
                        address
                    }
                    buyAmount
                    sellAmount
                    side
                    tradeAmount(in: USDT)
                    protocol
                    taker {
                      address
                    }
                    exchange{
                        name
                    }
                }
            }
        }`
        var lastTransactions = await this.axiosPostOperation(axios_link, axios_query, axios_bitquery_header).then(axios_res => {
            return { err: false, data: axios_res.data.data.ethereum.dexTrades };
        }).catch(axios_res_err => {
            return { err: true, data: axios_res_err };
        });
        if (lastTransactions.err || lastTransactions.data === null) return {
            "status": 400,
            'message': "failed get last 50 transactions.",
            "error": lastTransactions.err
        };
        console.log("lastTransactions",lastTransactions);
        lastTransactions.data = lastTransactions.data.map((each) => {

            //test
            console.log("===============");
            let agoTime = this.getAgoTime(each.block.timestamp.unixtime);
            let date = new Date(each.block.timestamp.unixtime * 1000);
            let txDate = date.toLocaleString();
            let from = each.transaction.txFrom.address;
            let to = each.transaction.to.address;

            if (each.side === "BUY") {
                
                return { 
                    block: each.block.height, 
                    amount1: each.buyAmount, 
                    token1: each.buyCurrency.symbol, 
                    tokenAddress1: each.buyCurrency.address, 
                    tradeAmountUSD: each.tradeAmount, 
                    amount2: each.sellAmount, 
                    token2: each.sellCurrency.symbol, 
                    tokenAddress2: each.sellCurrency.address, 
                    agoTime: agoTime, 
                    time: txDate, 
                    from:from,
                    to:to,
                    tokenPriceUSD: (each.tradeAmount / each.buyAmount), 
                    side: each.side, 
                    hash: each.transaction.hash,
                    address: each.taker.address, 
                    protocol: each.exchange.name
                }
            }
            else if (each.side === "SELL") {
                return { 
                    block: each.block.height, 
                    amount1: each.sellAmount, 
                    token1: each.sellCurrency.symbol, 
                    tokenAddress1: each.sellCurrency.address, 
                    tradeAmountUSD: each.tradeAmount, 
                    amount2: each.buyAmount, 
                    token2: each.buyCurrency.symbol, 
                    tokenAddress2: each.buyCurrency.address, 
                    agoTime: agoTime, 
                    time: txDate,
                    from:from,
                    to:to,
                    tokenPriceUSD: (each.tradeAmount / each.sellAmount), 
                    side: each.side, 
                    hash: each.transaction.hash,
                    address: each.taker.address, 
                    protocol: each.exchange.name
                }
            }
        });
        lastTransactions.data = lastTransactions.data.sort((a, b) => a.block > b.block);
        // this.myCache.set('last50Transactions_' + tokenAddress, lastTransactions.data);
        return {
            "status": 200,
            'message': "success get last 50 transactions.",
            "data": lastTransactions.data,
        };
    }

    async getCurrentHolders(tokenAddress) {

        // return await this.axiosPostOperation("https://bscscan.com/token/" + tokenAddress, "", test_header).then(axios_res => {
        //     return axios_res;
        // }).catch(axios_res_err => {
        //     return 0;
        // });

        let result = await fetch("https://bscscan.com/token/" + tokenAddress)
        // let result = await fetch("https://google.com" )
        // let result = await fetch(BNBPriceURL)
            .then((response) => {
                console.log("result", response);
                return response.text();
            }).catch((err) => {
                console.log("err", err);
            });
            
        console.log("dom:::::", result);

        // let result = await fetch("https://bscscan.com/token/" + tokenAddress,test_header);
        // const dom = new JSDOM(result.body);
        let element = Array
            .prototype
            .slice
            .call(new JSDOM(result).window.document.getElementsByTagName('div'))
            .filter(el => el.innerHTML.includes('addresses') && el.children.length === 0)[0];
        let holders = element.innerHTML
            .replace(' addresses', '')
            .replace(/\n/g, "")
            .replace(/[\t ]+\</g, "<")
            .replace(/\>[\t ]+\</g, "><")
            .replace(/\>[\t ]+$/g, ">")
            .replace(',', '');

        let obj = { holders: holders };

        // get price
        // let element1 = Array
        //     .prototype
        //     .slice
        //     .call(new JSDOM(result).window.document.querySelectorAll('.card-body .d-block'))
        //     // .filter(el => el.children.length === 0);
        // element1.map(each => {console.log(each.innerHTML)});

        return parseInt(holders);
    }

    async getTokenInfo(tokenAddress)
    {
        let info = await fetch("https://api.bscscan.com/api?module=token&action=tokeninfo&contractaddress=" + tokenAddress + "&apikey=" + BSCscanApikey )
            .then((res) => {
                return res.json();
            })
            .catch(() => {status:"failed"});
            
            console.log("res:::", info);
            return info.result[0];
    }



}

export default Util;
