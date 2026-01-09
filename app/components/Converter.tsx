"use client";

import { useState } from "react";

type Props = {
  toCurrency: string;
};

export default function Convertor({ toCurrency }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setError("");
    setResult(null);

    
    const amount = input.match(/\d+(\.\d+)?/)?.[0];
    setAmount(parseFloat(amount || "0"));
    const fromCurrency = input.match(/[a-zA-Z]{3}/)?.[0]?.toUpperCase();
    setCurrency(fromCurrency || "");

    if (!amount || !fromCurrency) {
      setError("Enter value like: 100 USD");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/convert?from=${currency}&to=${toCurrency}&amount=${amount}`
      );

      if (!res.ok) throw new Error("Conversion failed");

      const data = await res.json();

      if (data.result === "success") {
        setResult(data.conversion_result);
        setInput("");
      } else {
        setError("Conversion failed");
      }
    } catch {
      setError("Unable to convert currency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-3">
      <p className="font-bold">
        Convert currency to {toCurrency}
      </p>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="e.g. 100 USD"
          value={input}
          onChange={(e) => setInput(e.target.value)}
            className="border-2 border-gray-300 rounded-xl px-4 py-2 flex-1 focus:outline-none"
        />

        <button
        type="button"
          onClick={handleConvert}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl"
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>

      {result !== null && (
        <p className="text-gray-300 font-semibold text-center">
          {amount} {currency} = {result.toFixed(2)} {toCurrency}
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
