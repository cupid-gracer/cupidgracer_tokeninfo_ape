// Token Address
module.exports = {
  ISATokenAddress: "0x1ccc22cc1658ea8581adce07e273c3c92b6065d0",
  BNBTokenAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  BUSDTokenAddress: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  USDTTokenAddress: "0x55d398326f99059ff775485246999027b3197955",
  CAKETokenAddress: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",

  // LP Staking Address
  LPAddressV1: "0xb6ec86562e0cd125b4a1586036b6f13d47fd09b6",
  LPAddressV2: "0x8b469572Fa719CDFf3E0998EdEAeF500d9afc7e0",

  // Pancake Address
  PancakeFactoryV1: "0xBCfCcbde45cE874adCB698cC183deBcF17952812",
  PancakeFactoryV2: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",

  // BSCscan api
  BSCscanApikey: "NWMV6N218S7DTUX1XJ61FB5KZRNPRXMQHY",

  /* import from abi */
  ISAAbi: require("./abi/ISA_ABI.json"),
  ERC20Abi: require("./abi/ERC20.json"),
  PancakeFactoryAbi: require("./abi/PancakeFactory.json"),

  BNBPriceURL:
    "https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=NWMV6N218S7DTUX1XJ61FB5KZRNPRXMQHY",
  
  axios_link: "https://graphql.bitquery.io",
  axios_bitquery_header : {
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-API-KEY': 'BQYH1avkjKkPZFYKru9VSb71fBnLdz05',
    }
  },
  test_header:{
    mode: 'no-cors', // this is to prevent browser from sending 'OPTIONS' method request first
    dest: 'document',
    method: 'GET',
    credentials: "same-origin",
  }
};
