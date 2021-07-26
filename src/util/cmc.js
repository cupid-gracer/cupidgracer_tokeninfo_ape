/**
 * CoinMarketCap API functions
 */

import { LocalGasStationRounded } from "@material-ui/icons";
import axios from "axios";
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
    CMCApikey,
} from "../constants/constant.js";

class CMC {
    constructor()
    {

    }

    axiosGetOperation = function (link, header = "") {
        return new Promise(function (resolve, reject) {
            axios.get(link,"", {header: header}).then(res => {
                resolve(res);
                console.log("axiosGetOperation done: ", res);
            }).catch(err => {
                reject(err);
                console.log("axiosGetOperation err: ", err);
            });
        });
    }

    async getCMCId(symbol_or_address){
        let cmcids = localStorage.getItem("cmcids");
        if( cmcids.length == 0 )
        {
            cmcids = await axiosGetOperation("https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=" + CMCApikey);
            localStorage.setItem("cmcids", cmcids);
        }

        let data = cmcids.data;
        let id = 0;
        data.forEach(item => {
            if(item.symbol == "symbol_or_address")
            {
                id = item.id;
                break;
            }
            if(item.platform == undefined) continue;
            if(item.platform.token_address == symbol_or_address) 
            {
                id = item.id;
                break;
            }
        });
        return id;
    }

    async getCryptoCurrencyInfo(symbol_or_address)
    {
        let cmcid = await this.getCMCId(symbol_or_address);
        if(cmcid == 0) return 0;
        let data = await axiosGetOperation("https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?CMC_PRO_API_KEY=" + CMCApikey + "&id=" + cmcid);
        let info = data.data.cmcid;
        return info;
    }

}

export default CMC;
