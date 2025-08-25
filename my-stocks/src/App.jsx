import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import MarketCards from "./components/MarketCards";
import StockTable from "./components/StockTable";
import StockChart from "./components/StockChart";
import MarketMovers from "./components/MarketMovers";

const ALPHA_API_KEY = "FPC6XTS22R7OU645"; // Alpha Vantage key
const FINNHUB_API_KEY = "YOUR_FINNHUB_KEY"; // 🔑 get from finnhub.io

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [selected, setSelected] = useState("AAPL");

  useEffect(() => {
    fetchStockData("AAPL");
    fetchStockData("TSLA");
    fetchStockData("MSFT");
    fetchStockData("AMZN");
    fetchStockData("META");
  }, []);

  async function fetchStockData(symbol) {
    try {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_API_KEY}`
      );
      const data = await res.json();
      const series = data["Time Series (Daily)"];
      if (!series) return;

      const lastDate = Object.keys(series)[0];
      const lastPrice = parseFloat(series[lastDate]["4. close"]);
      const prevDate = Object.keys(series)[1];
      const prevPrice = parseFloat(series[prevDate]["4. close"]);
      const change = lastPrice - prevPrice;
      const pctChange = (change / prevPrice) * 100;

      setStocks((prev) => [
        ...prev.filter((s) => s.symbol !== symbol),
        { symbol, price: lastPrice, change, pctChange },
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Markets Today</h1>

        {/* Cards */}
        <MarketCards />

        {/* Market Summary + Chart */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4">Market Summary</h2>
            <StockTable stocks={stocks} onSelect={setSelected} />
          </div>
          <div>
            {/* ✅ Chart with Finnhub WebSocket */}
            <StockChart symbol={selected} apiKey={FINNHUB_API_KEY} />
          </div>
        </div>

        {/* Full-Width Market Movers Section */}
        <div className="mt-10">
          <MarketMovers />
        </div>
      </div>
    </div>
  );
}
