import React from 'react';
import { useSelector } from 'react-redux';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { selectTokenPair } from '../../features/tokenPairSlice';

function TradingView() {
  const tokenPair = useSelector(selectTokenPair);

  return (
      <TradingViewWidget
        symbol={`${tokenPair}`}
        theme={Themes.DARK}
        withdateranges
        hide_side_toolbar={false} 
        details={false}
        autosize
      />
  );
}

export default TradingView;
