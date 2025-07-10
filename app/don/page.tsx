"use client";

import React, { useState } from "react";

const mobileMoneyNumbers = [
  {
    provider: "M-Pesa",
    number: "+243 970 000 000",
  },
  {
    provider: "Airtel Money",
    number: "+243 980 000 000",
  },
  // Add more providers/numbers as needed
];

const presetAmounts = [10, 20, 50, 100];

const DonationPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    customAmount: "",
    frequency: "once",
    name: "",
    email: "",
    message: "",
  });
  const [copied, setCopied] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAmountClick = (amount: number) => {
    setForm({ ...form, amount: amount.toString(), customAmount: "" });
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, amount: "", customAmount: e.target.value });
  };

  const handleFrequency = (frequency: string) => {
    setForm({ ...form, frequency });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopied(number);
    setTimeout(() => setCopied(null), 1500);
  };

  // Calculate the selected amount
  const selectedAmount = form.amount || form.customAmount;

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Hero Banner */}
      <div
        className="w-full h-64 md:h-80 flex flex-col justify-center items-center text-center relative"
        style={{
          backgroundImage: "url('/assets/bg4.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Soutenez la mission de GIRENAD
          </h1>
          <p className="text-lg md:text-2xl text-white mb-4 drop-shadow-lg">
            Votre don aide à protéger la biodiversité, à soutenir les
            communautés locales et à promouvoir le développement durable au
            Nord-Kivu.
          </p>
          {/* <span className="inline-block bg-green-600 text-white font-semibold px-4 py-1 rounded-full text-sm md:text-base shadow-lg">
            Chaque don compte !
          </span> */}
        </div>
      </div>

      {/* Main Donation Card */}
      <div className="max-w-2xl mx-auto -mt-20 md:-mt-32 mb-10 px-2">
        <div className="bg-white/95 rounded-xl shadow-xl p-6 md:p-10 backdrop-blur-md">
          {/* Mobile Money Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 mb-2 text-center">
              Faire un don par Mobile Money
            </h2>
            <p className="text-gray-700 text-center mb-4">
              Pour les dons locaux, utilisez l'un des numéros suivants :
            </p>
            <div className="flex flex-col gap-3">
              {mobileMoneyNumbers.map((item) => (
                <div
                  key={item.number}
                  className="flex items-center justify-between bg-green-100 rounded-lg px-4 py-2"
                >
                  <div>
                    <span className="font-semibold text-green-800">
                      {item.provider}:
                    </span>
                    <span className="ml-2 text-green-900 font-mono">
                      {item.number}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.number)}
                    className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                  >
                    {copied === item.number ? "Copié!" : "Copier"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Frequency */}
            <div className="flex justify-center gap-4 mb-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-full font-semibold border transition-all ${
                  form.frequency === "once"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-green-700 border-green-400"
                }`}
                onClick={() => handleFrequency("once")}
              >
                Don unique
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full font-semibold border transition-all ${
                  form.frequency === "monthly"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-green-700 border-green-400"
                }`}
                onClick={() => handleFrequency("monthly")}
              >
                Don mensuel
              </button>
            </div>
            {/* Amounts */}
            <div className="flex flex-wrap justify-center gap-3 mb-2">
              {presetAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  className={`px-4 py-2 rounded-lg font-semibold border transition-all ${
                    form.amount === amt.toString()
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-green-700 border-green-400"
                  }`}
                  onClick={() => handleAmountClick(amt)}
                >
                  {amt}€
                </button>
              ))}
              <input
                type="number"
                min="1"
                placeholder="Autre"
                className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                value={form.customAmount}
                onChange={handleCustomAmount}
              />
            </div>
            {/* Donor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                  placeholder="Votre email"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message (optionnel)
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                placeholder="Un message pour GIRENAD"
                rows={2}
              />
            </div>
            {/* Card Info Fields (disabled) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100"
                  placeholder="1234 5678 9012 3456"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Expiration
                </label>
                <input
                  type="text"
                  name="exp"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100"
                  placeholder="MM/AA"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  name="cvc"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-100"
                  placeholder="CVC"
                  disabled
                />
              </div>
            </div>
            <div className="w-full bg-yellow-100 text-yellow-800 text-center font-semibold rounded-lg py-2 mt-2">
              Le paiement par carte sera disponible prochainement.
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition mt-2"
              disabled
            >
              Faire un don
            </button>
          </form>
          {submitted && (
            <div className="text-center mt-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">
                Merci pour votre soutien !
              </h2>
              <p className="text-gray-700">
                Nous avons bien reçu votre intention de don. Nous vous
                contacterons si besoin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Impact Section */}
      <div className="max-w-2xl mx-auto mb-10 px-2">
        <div className="bg-green-100 rounded-xl shadow p-6 md:p-8 mt-4">
          <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
            Votre impact
          </h3>
          <ul className="list-disc pl-5 text-gray-700 text-base space-y-1">
            <li>10€ = 1 arbre planté</li>
            <li>25€ = Formation d'un agriculteur</li>
            <li>50€ = Soutien à une famille pour des foyers améliorés</li>
            <li>100€ = Protection d'une parcelle de forêt communautaire</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
