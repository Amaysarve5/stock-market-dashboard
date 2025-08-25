import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "d2lhkr1r01qr27gjbi1gd2lhkr1r01qr27gjbi20";

// Keep the watchlist small for free API limits
const watchlist = ["AAPL", "MSFT", "TSLA", "AMZN"];

const MarketCards = () => {
  const [overview, setOverview] = useState({
    market: "Loading...",
    leader: "SPY",
    hottestSector: "Fetching...",
    worstSector: "Fetching...",
    topStock: "Fetching...",
    worstStock: "Fetching...",
  });

  // Fetch sector performance
  const fetchSectorPerformance = async () => {
    try {
      const res = await axios.get(
        `https://www.alphavantage.co/query?function=SECTOR&apikey=${API_KEY}`
      );
      const sectors = res.data["Rank A: Real-Time Performance"];
      if (!sectors) return;

      const entries = Object.entries(sectors);
      const sorted = entries.sort(
        (a, b) => parseFloat(b[1]) - parseFloat(a[1])
      );

      setOverview((prev) => ({
        ...prev,
        hottestSector: `${sorted[0][0]} ${sorted[0][1]}`,
        worstSector: `${sorted[sorted.length - 1][0]} ${sorted[sorted.length - 1][1]}`,
      }));
    } catch (error) {
      console.error("Error fetching sectors", error);
    }
  };

  // Fetch one stock at a time (rotating through watchlist)
  let stockIndex = 0;
  const fetchNextStock = async () => {
    try {
      const symbol = watchlist[stockIndex];
      stockIndex = (stockIndex + 1) % watchlist.length; // rotate

      const res = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      const q = res.data["Global Quote"];
      if (!q) return;

      const changePercent = parseFloat(q["10. change percent"]);

      setOverview((prev) => {
        // Update top/worst dynamically
        let top = prev.topStock;
        let worst = prev.worstStock;

        if (top === "Fetching..." || changePercent > parseFloat(top.split(" ")[1] || 0)) {
          top = `${symbol} ${changePercent.toFixed(2)}%`;
        }
        if (worst === "Fetching..." || changePercent < parseFloat(worst.split(" ")[1] || 0)) {
          worst = `${symbol} ${changePercent.toFixed(2)}%`;
        }

        return { ...prev, topStock: top, worstStock: worst };
      });
    } catch (error) {
      console.error("Error fetching stock", error);
    }
  };

  // Market status (Bullish / Bearish / Neutral) using SPY
  const fetchMarketDirection = async () => {
    try {
      const res = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${API_KEY}`
      );
      const spy = res.data["Global Quote"];
      if (!spy) return;

      const change = parseFloat(spy["10. change percent"]);
      let market = "Neutral";
      if (change > 0.3) market = "Bullish";
      else if (change < -0.3) market = "Bearish";

      setOverview((prev) => ({ ...prev, market }));
    } catch (err) {
      console.error("Error fetching SPY", err);
    }
  };

  useEffect(() => {
    fetchSectorPerformance();
    fetchMarketDirection();
    fetchNextStock();

    const sectorInterval = setInterval(fetchSectorPerformance, 5 * 60 * 1000); // every 5 min
    const marketInterval = setInterval(fetchMarketDirection, 60 * 1000); // every 1 min
    const stockInterval = setInterval(fetchNextStock, 15 * 1000); // fetch 1 stock every 15s

    return () => {
      clearInterval(sectorInterval);
      clearInterval(marketInterval);
      clearInterval(stockInterval);
    };
  }, []);

  return (
    <div className="grid grid-cols-6 gap-4 my-6">
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md">
        <h2 className="text-gray-400 text-sm">Market</h2>
        <p className={`text-lg font-bold ${
          overview.market === "Bullish"
            ? "text-green-500"
            : overview.market === "Bearish"
            ? "text-red-500"
            : "text-yellow-400"
        }`}>
          {overview.market}
        </p>
      </div>
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md">
        <h2 className="text-gray-400 text-sm">Leader</h2>
        <p className="text-lg font-bold text-white">{overview.leader}</p>
      </div>
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md">
        <h2 className="text-gray-400 text-sm">Hottest Sector</h2>
        <p className="text-lg font-bold text-green-400">{overview.hottestSector}</p>
      </div>
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md">
        <h2 className="text-gray-400 text-sm">Worst Sector</h2>
        <p className="text-lg font-bold text-red-400">{overview.worstSector}</p>
      </div>
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md">
        <h2 className="text-gray-400 text-sm">Top Stock</h2>
        <p className="text-lg font-bold text-green-500">{overview.topStock}</p>
      </div>
      <div className="bg-gray-800 rounded-2xl p-4 shadow-md">
        <h2 className="text-gray-400 text-sm">Worst Stock</h2>
        <p className="text-lg font-bold text-red-500">{overview.worstStock}</p>
      </div>
    </div>
  );
};

export default MarketCards;
