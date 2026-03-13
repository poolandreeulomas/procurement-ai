"use client";

import { useState } from "react";

export default function RequestInput() {
    const [requestText, setRequestText] = useState("");

    const handleAnalyze = async () => {
        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestText }),
            });

            const data = await res.json();
            console.log("/api/analyze response:", data);

            // Clear the textarea after successful analysis
            setRequestText("");
        } catch (error) {
            console.error("/api/analyze error:", error);
        }
    };

    return (
        <section className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    AI Procurement Analyzer
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Paste procurement request here
                </p>
            </header>

            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="procurementRequest">
                Procurement request
            </label>
            <textarea
                id="procurementRequest"
                value={requestText}
                onChange={(event) => setRequestText(event.target.value)}
                rows={8}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="We need around 200 laptops for the Zurich office, preferably Dell or Lenovo, delivery before July, budget around 1200 each."
            />

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={handleAnalyze}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!requestText.trim()}
                >
                    Analyze Request
                </button>
            </div>
        </section>
    );
}
