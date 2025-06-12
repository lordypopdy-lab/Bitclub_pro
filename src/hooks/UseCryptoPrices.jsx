import React, { useEffect, useState } from 'react';

const UseCryptoPrices = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const socket = new WebSocket('wss://bitclub.onrender.com');

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const symbol = msg.symbol?.toUpperCase();

      // console.log(msg)

      if (!symbol) return;

      setPrices((prev) => ({
        ...prev,
        [symbol]: {
          ...prev[symbol],
          ...msg,
        },
      }));
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Live Binance Prices</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(prices).map(([symbol, item]) => (
          <li key={symbol} className="p-2 border rounded-xl shadow-md">
            <strong>{item.symbol.toUpperCase()}</strong>
            <div>
              {item.price && (
                <div>💰 Trade Price: ${Number(item.price).toFixed(2)}</div>
              )}
              {item.quantity && (
                <div>📦 Quantity: {Number(item.quantity).toFixed(2)}</div>
              )}
              {item.markPrice && (
                <div>📌 Mark Price: ${Number(item.markPrice).toFixed(2)}</div>
              )}
              {item.priceChangePercent && (
                <div className="text-sm mt-1">
                  <span
                    className={
                      parseFloat(item.priceChangePercent) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    📈 24h Change: {Number(item.priceChange).toFixed(2)} (
                    {Number(item.priceChangePercent).toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UseCryptoPrices;
