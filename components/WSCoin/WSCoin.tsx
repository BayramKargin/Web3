import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface CoinTickerProps {
  symbol?: string;
  logo: string;
  wsUrl: string;
}

const CoinTicker: React.FC<CoinTickerProps> = ({ symbol = "ETH", logo, wsUrl }) => {
  const [tradeValue, setTradeValue] = useState<string>('');
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [colorClass, setColorClass] = useState<string>('');

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const price = parseFloat(data.p).toFixed(2);

      if (prevPrice !== null) {
        setColorClass(parseFloat(price) > prevPrice ? 'text-green-500' : 'text-red-500');
      }

      setPrevPrice(parseFloat(price));
      setTradeValue(price);
    };

    return () => {
      ws.close();
    };
  }, [prevPrice, wsUrl]);

  return (
    <div className={`ticker-item ${colorClass}`}>
      <Image src="/images/logoblue.png" alt={symbol} width={24} height={24} className="ticker-logo" />
      <p className="ticker-value">{tradeValue}$</p>
    </div>
  );
};

const TickerRow: React.FC = () => {
  const tickers = [
    { logo: '/images/logoblue.png', wsUrl: 'wss://stream.binance.com:9443/ws/ethusdt@trade' },
  ];

  return (
    <div className="ticker-row">
      {tickers.map((ticker, index) => (
        <CoinTicker key={index} {...ticker} />
      ))}
    </div>
  );
};

const WSCoin: React.FC = () => {
  return (
    <div>
      <TickerRow />
    </div>
  );
};

export default WSCoin;
