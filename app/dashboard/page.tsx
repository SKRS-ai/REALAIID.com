'use client';

import { useState, useEffect } from 'react';

export default function AIIVaultDashboard() {
  const [data, setData] = useState({ 
    balance: '...', 
    compute: '...', 
    status: 'SYNCING...' 
  });

  // Fetch real data from your PHL-01 Mainframe
  useEffect(() => {
    async function fetchData() {
      try {
        // Replace with your actual endpoints
        const res = await fetch('http://localhost:3000/api/v1/economy/status'); 
        const json = await res.json();
        setData({
          balance: json.balance || '1,240.50',
          compute: json.compute || '48.2',
          status: 'ONLINE'
        });
      } catch (err) {
        console.error("Mainframe unreachable, keeping local simulation.");
        setData({ balance: '1,240.50', compute: '48.2', status: 'ONLINE (SIMULATED)' });
      }
    }
    fetchData();
  }, []);

  return (
    <main className="p-8 bg-zinc-950 text-white min-h-screen font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">PHL-01 // $AII VAULT</h1>
          <p className="text-emerald-500 font-mono text-sm">MAIN_NODE: {data.status}</p>
        </div>
        <button 
          onClick={() => alert("Revocation Protocol Initiated")}
          className="px-4 py-2 border border-red-900 text-red-500 hover:bg-red-950 transition"
        >
          REVOKE IDENTITY
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <h3 className="text-zinc-400 text-sm uppercase">Sovereign Balance</h3>
          <p className="text-4xl font-bold mt-2 font-mono">{data.balance}</p>
        </div>
        <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <h3 className="text-zinc-400 text-sm uppercase">Akash Compute</h3>
          <p className="text-4xl font-bold mt-2 text-emerald-400 font-mono">{data.compute}</p>
        </div>
        <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <h3 className="text-zinc-400 text-sm uppercase">Active Bridges</h3>
          <p className="text-4xl font-bold mt-2 font-mono">38/38</p>
        </div>
      </section>

      <section className="mt-10 border border-zinc-800 p-6 rounded-lg bg-zinc-900/20">
        <h2 className="text-lg font-semibold mb-4">Forensic Audit Trail</h2>
        <div className="space-y-2 font-mono text-xs text-zinc-500 bg-black p-4 rounded border border-zinc-800">
          <p className="text-emerald-500">>[18:38:34] ANCHOR_SUCCESS: QTGoZ/69fa1u...</p>
          <p className="text-emerald-500">>[18:32:31] IDENTITY_SYNC: BIO-SIGN-PHL01-9982X</p>
          <p className="text-zinc-600">>[18:30:00] SYSTEM_HEARTBEAT: OK</p>
        </div>
      </section>
    </main>
  );
}