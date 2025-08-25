import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_KEY = "d2lhkr1r01qr27gjbi1gd2lhkr1r01qr27gjbi20"; // replace with your Finnhub API key
const symbols = ["AAPL", "AMD", "AMZN", "TSLA", "META"];

const StockTable = () => {
  const [quotes, setQuotes] = useState({});
  const [status, setStatus] = useState("connecting");
  const wsRef = useRef(null);

  // --- Update state helper ---
  const updateQuote = (sym, price, ts) => {
    setQuotes((prev) => ({
      ...prev,
      [sym]: { symbol: sym, price, ts },
    }));
  };

  // --- Polling fallback (HTTP fetch) ---
  const fetchHTTP = async () => {
    try {
      for (let sym of symbols) {
        const res = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`
        );
        updateQuote(sym, res.data.c, res.data.t * 1000);
      }
      setStatus("http-polling");
    } catch (err) {
      console.error("HTTP fetch failed", err);
      setStatus("error");
    }
  };

  // --- WebSocket connection ---
  useEffect(() => {
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setStatus("online");
      symbols.forEach((sym) => {
        ws.send(JSON.stringify({ type: "subscribe", symbol: sym }));
        console.log("📡 Subscribed to", sym);
      });
    };

    ws.onmessage = (event) => {
      console.log("Raw WS:", event.data);
      const payload = JSON.parse(event.data);
      if (payload.type === "trade" && Array.isArray(payload.data)) {
        for (const t of payload.data) {
          updateQuote(t.s, t.p, t.t);
        }
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error", err);
      setStatus("error");
    };

    ws.onclose = (e) => {
      console.warn("⚠️ WebSocket closed:", e);
      setStatus("offline");
      // Start HTTP polling fallback
      fetchHTTP();
      const poller = setInterval(fetchHTTP, 10000);
      return () => clearInterval(poller);
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        symbols.forEach((sym) => {
          wsRef.current.send(
            JSON.stringify({ type: "unsubscribe", symbol: sym })
          );
        });
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-4 mt-6 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-lg">📈 Market Summary</h2>
        <span
          className={
            "text-xs px-2 py-1 rounded " +
            (status === "online"
              ? "bg-green-600/20 text-green-400"
              : status === "http-polling"
              ? "bg-blue-600/20 text-blue-400"
              : status === "connecting"
              ? "bg-yellow-600/20 text-yellow-400"
              : status === "error"
              ? "bg-red-600/20 text-red-400"
              : "bg-gray-600/20 text-gray-300")
          }
        >
          {status}
        </span>
      </div>

      <table className="w-full text-white text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="px-4 py-2 text-left">Symbol</th>
            <th className="px-4 py-2 text-left">Last Price</th>
            <th className="px-4 py-2 text-left">Updated</th>
          </tr>
        </thead>
        <tbody>
          {symbols.map((sym) => {
            const q = quotes[sym];
            return (
              <tr
                key={sym}
                className="border-b border-gray-700 hover:bg-gray-700/30"
              >
                <td className="px-4 py-2 font-semibold">{sym}</td>
                <td className="px-4 py-2">
                  {q?.price ? `$${q.price.toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-2">
                  {q?.ts ? new Date(q.ts).toLocaleTimeString() : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="text-xs text-gray-400 mt-2">
        Data via Finnhub WebSocket (with HTTP fallback).
      </p>
    </div>
  );
};

export default StockTable;
