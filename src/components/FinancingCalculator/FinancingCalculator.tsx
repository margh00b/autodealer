"use client";

import { useState, useEffect } from "react";

interface FinancingCalculatorProps {
  price: number;
}

export default function FinancingCalculator({
  price,
}: FinancingCalculatorProps) {
  const [vehiclePrice, setVehiclePrice] = useState<number>(price); // now editable
  const [loanTerm, setLoanTerm] = useState<number>(60); // months
  const [downPayment, setDownPayment] = useState<number>(0);
  const [tradeIn, setTradeIn] = useState<number>(0);
  const [apr, setApr] = useState<number>(5); // annual %
  const [paymentFrequency, setPaymentFrequency] = useState<
    "Monthly" | "Biweekly"
  >("Monthly");

  // If the prop changes, update internal state
  useEffect(() => {
    setVehiclePrice(price);
  }, [price]);

  const principal = vehiclePrice - downPayment - tradeIn;

  const calculatePayment = (): number => {
    const monthlyRate = apr / 100 / 12;
    const biweeklyRate = apr / 100 / 26;
    const n =
      paymentFrequency === "Monthly"
        ? loanTerm
        : Math.ceil((loanTerm / 12) * 26);

    const rate = paymentFrequency === "Monthly" ? monthlyRate : biweeklyRate;

    if (rate === 0) return principal / n;

    return (principal * rate) / (1 - Math.pow(1 + rate, -n));
  };

  const paymentAmount = calculatePayment();
  const termOptions = [36, 48, 60, 72, 84];

  return (
    <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold">Financing Calculator</h2>

      {/* Vehicle Price */}
      <div>
        <label className="block font-medium mb-1">Vehicle Price</label>
        <input
          type="number"
          value={vehiclePrice}
          onChange={(e) => setVehiclePrice(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-200"
        />
      </div>

      {/* Loan Term */}
      <div>
        <label className="block font-medium mb-1">Term (Months)</label>
        <div className="flex gap-2">
          {termOptions.map((term) => (
            <button
              key={term}
              onClick={() => setLoanTerm(term)}
              className={`px-3 py-1 rounded-lg border transition-all duration-300 transform hover:bg-maroon hover:text-white cursor-pointer ${
                loanTerm === term
                  ? "bg-maroon text-white border-maroon"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Frequency */}
      <div>
        <label className="block font-medium mb-1">Payment Frequency</label>
        <div className="flex gap-2">
          {["Monthly", "Biweekly"].map((freq) => (
            <button
              key={freq}
              onClick={() =>
                setPaymentFrequency(freq as "Monthly" | "Biweekly")
              }
              className={`px-3 py-1 rounded-lg border transition-all duration-300 transform hover:bg-maroon hover:text-white cursor-pointer ${
                paymentFrequency === freq
                  ? "bg-maroon text-white border-maroon"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      {/* Trade-In */}
      <div>
        <label className="block font-medium mb-1">Trade-In Value</label>
        <input
          type="number"
          value={tradeIn}
          onChange={(e) => setTradeIn(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-200"
          placeholder="0"
        />
      </div>

      {/* Down Payment */}
      <div>
        <label className="block font-medium mb-1">Down Payment</label>
        <input
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-200"
          placeholder="0"
        />
      </div>

      {/* Estimated APR */}
      <div>
        <label className="block font-medium mb-1">Estimated APR (%)</label>
        <input
          type="number"
          value={apr}
          onChange={(e) => setApr(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-maroon focus:border-maroon transition-all duration-200"
          placeholder="5"
        />
      </div>

      {/* Estimated Payment */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center transition-all duration-300">
        <p className="text-gray-600">Est. {paymentFrequency} Payment</p>
        <p className="text-2xl font-bold text-maroon">
          $
          {paymentAmount.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
