// MarketMovers.jsx
import React from "react";

// --- Mock Data ---
const gainers = [
  { ticker: "HUM", price: 260.29, change: "+12.58%", vol: "5.49M", rvol: "2.63", float: "120.42M", mcap: "31.42B" },
  { ticker: "MRVL", price: 81.78, change: "+7.13%", vol: "41.77M", rvol: "2.84", float: "857.1M", mcap: "70.51B" },
  { ticker: "RBLX", price: 125.23, change: "+5.97%", vol: "10.40M", rvol: "1.52", float: "625.06M", mcap: "64.94B" },
  { ticker: "EA", price: 155.73, change: "+5.77%", vol: "4.86M", rvol: "1.53", float: "226.8M", mcap: "39.13B" },
  { ticker: "TW", price: 145.97, change: "+5.76%", vol: "2.75M", rvol: "1.78", float: "235.18M", mcap: "34.51B" },
];

const losers = [
  { ticker: "FCX", price: 39.08, change: "-9.61%", vol: "56.8M", rvol: "3.44", float: "1.43B", mcap: "56.12B" },
  { ticker: "TT", price: 432.54, change: "-8.13%", vol: "2.98M", rvol: "1.22", float: "222.47M", mcap: "96.46B" },
  { ticker: "GRMN", price: 221.49, change: "-7.34%", vol: "2.45M", rvol: "2.16", float: "163.23M", mcap: "42.64B" },
  { ticker: "NVO", price: 500.5, change: "-7.19%", vol: "6.16M", rvol: "0.56", float: "4.43B", mcap: "221.74B" },
  { ticker: "MDLZ", price: 65.16, change: "-6.52%", vol: "18.9M", rvol: "2.38", float: "1.29B", mcap: "84.38B" },
];

// --- Reusable Table Component ---
function StockTable({ title, data, type }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button className="bg-gray-800 px-3 py-1 text-sm rounded-md hover:bg-gray-700">
          Filter ▼
        </button>
      </div>

      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="py-2 px-2">Ticker</th>
              <th className="py-2 px-2">Price</th>
              <th className="py-2 px-2">Change</th>
              <th className="py-2 px-2">Vol</th>
              <th className="py-2 px-2">RVol</th>
              <th className="py-2 px-2">Float</th>
              <th className="py-2 px-2">MCap</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stock, i) => (
              <tr
                key={i}
                className="border-b border-gray-800 hover:bg-gray-800/40"
              >
                <td className="font-bold px-2 py-2">{stock.ticker}</td>
                <td className="px-2">${stock.price}</td>
                <td
                  className={`px-2 ${
                    type === "gainers" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stock.change}
                </td>
                <td className="px-2">{stock.vol}</td>
                <td className="px-2 text-blue-400">{stock.rvol}</td>
                <td className="px-2">{stock.float}</td>
                <td className="px-2">{stock.mcap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
        <span>Showing 1 to {data.length} of 50 entries</span>
        <div className="space-x-1">
          <button className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">
            Previous
          </button>
          <button className="px-2 py-1 rounded bg-green-600 text-white">
            1
          </button>
          <button className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">
            2
          </button>
          <button className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">
            3
          </button>
          <button className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function MarketMovers() {
  return (
    <div className="bg-black min-h-screen h-screen text-gray-200 flex flex-col">
      <h1 className="text-2xl font-bold p-4 border-b border-gray-800">
        Active Stocks
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow p-4">
        <StockTable title="Biggest Gainers" data={gainers} type="gainers" />
        <StockTable title="Biggest Losers" data={losers} type="losers" />
      </div>
    </div>
  );
}
