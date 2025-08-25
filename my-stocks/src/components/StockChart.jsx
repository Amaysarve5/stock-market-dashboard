// StockChart.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockChart({ symbol = "AAPL" }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate sample/mock stock data
    let data = [];
    let basePrice = 150;

    for (let i = 0; i < 30; i++) {
      basePrice += (Math.random() - 0.5) * 2;
      data.push({
        time: `${i + 1}`,
        price: basePrice.toFixed(2),
      });
    }
    setChartData(data);
  }, [symbol]);

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg w-full h-[500px] flex flex-col">
      <h2 className="text-lg font-semibold mb-3">{symbol} Sample Chart</h2>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4ade80"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {/* Stock Stats */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <h3 className="text-sm font-bold mb-2">Stats</h3>
          <p>Open: $149.50</p>
          <p>High: $152.10</p>
          <p>Low: $148.75</p>
          <p>Close: $150.25</p>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold mb-2">Actions</h3>
          <button className="bg-green-600 px-4 py-2 rounded-lg mb-2 hover:bg-green-700">
            Buy
          </button>
          <button className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">
            Sell
          </button>
        </div>

        {/* News Feed */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <h3 className="text-sm font-bold mb-2">News</h3>
          <ul className="text-xs space-y-1">
            <li>📈 Apple stock rises on strong earnings</li>
            <li>💡 New iPhone launch boosts market buzz</li>
            <li>🌍 Tech stocks rally in global markets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
