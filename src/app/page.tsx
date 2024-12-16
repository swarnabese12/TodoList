"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import HomeComponent from "./components/HomeComponent";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-10 p-6 bg-white shadow-lg rounded-lg max-w-lg">
        {/* Title */}
        {/* <h1 className="text-3xl font-bold text-blue-600">Welcome to TO DO LIST</h1> */}

        {/* Wallet Status */}
        {/* <div className="flex flex-col gap-3 items-center">
          <h2 className="text-lg">
            {publicKey
              ? `Connected Wallet: ${publicKey.toString()}`
              : "Please connect your wallet"}
          </h2>
        </div> */}

        {/* Home Component */}
        <div className="w-full">
          <HomeComponent />
        </div>
      </div>
    </main>
  );
}
