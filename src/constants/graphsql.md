# get dataset statement
{
    ethereum(network: bsc) {
      dexTrades(
        options: {limit: 100, asc: "timeInterval.minute"}
        date: {since: "2021-01-01"}
        baseCurrency: {is: "0x1ccc22cc1658ea8581adce07e273c3c92b6065d0"}
        quoteCurrency: {is: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"}
      ) {
        timeInterval {
          minute(count: 60)
        }
        high: quotePrice(calculate: maximum)
        low: quotePrice(calculate: minimum)
        open: minimum(of: block, get: quote_price)
        close: maximum(of: block, get: quote_price)
        baseCurrency {
          name
        }
        quoteCurrency {
          name
        }
        exchange{
          fullName
        }
      }
    }
  }

  