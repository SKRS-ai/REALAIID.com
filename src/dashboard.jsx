// ... (Previous imports and setup)

const IDCard = ({ stats, bridgeCount }) => (
  <div className="relative w-[500px] h-[280px] bg-slate-950 border border-amber-500/50 rounded-xl overflow-hidden p-6 shadow-[0_0_50px_rgba(184,134,11,0.2)]">
    {/* Grid Overlay */}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
    
    <div className="relative z-10 flex h-full">
      {/* Sidebar Logo */}
      <div className="w-12 h-full flex flex-col justify-between border-r border-amber-500/20 pr-4">
        <div className="rotate-[-90deg] origin-left translate-y-32 whitespace-nowrap">
           <span className="text-amber-500 font-serif font-black text-xl tracking-tighter">REALAiID</span>
           <span className="text-[7px] text-slate-500 ml-2 font-black uppercase tracking-[0.2em]">Commonwealth of Digital Identity</span>
        </div>
        <Shield className="text-amber-500/50" size={24} />
      </div>

      {/* Main Card Content */}
      <div className="flex-1 pl-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="text-[7px] text-amber-500/80 font-black uppercase tracking-[0.3em]">Sovereign Status // Neutralized Synthetic Fraud</div>
          <div className="w-16 h-20 bg-slate-900 border border-amber-500/30 rounded overflow-hidden">
             <img src="/api/placeholder/neural-portrait" className="w-full h-full object-cover grayscale brightness-125" alt="Neural Ingest" />
          </div>
        </div>

        <div className="mb-2">
          <h4 className="text-xl font-bold tracking-tight text-white">{stats.name}</h4>
          <div className="flex items-center gap-2 text-[8px] text-slate-400 font-bold uppercase tracking-widest">
            <Activity size={10} className="text-amber-500 animate-pulse" /> Biological Frequency Anchor
          </div>
        </div>

        <div className="mt-4">
          <div className="text-amber-500 font-black text-lg tracking-widest mb-1">BRIDGES ACTIVE: {bridgeCount} / 35</div>
          <div className="flex gap-4 items-center">
             <div className="w-24 h-24 bg-white p-1 rounded-sm">
                <img src="/api/placeholder/qr-code" className="w-full h-full" alt="Juridical Knot QR" />
             </div>
             <div className="flex-1">
                <div className="text-[6px] text-slate-500 font-black uppercase tracking-widest mb-2 leading-relaxed">
                   Secure Scan // Bridge Authorizations // Juridical & Financial Knots
                </div>
                <div className="text-[8px] text-white font-mono">
                   SOVEREIGN ID: {stats.id}
                </div>
                <div className="text-amber-500 font-black text-[10px] tracking-tighter">
                   SOVEREIGN CLASS A
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Node Indicator Corner */}
    <div className="absolute bottom-4 right-4 text-[6px] text-slate-600 font-mono text-right">
       PHL-01<br/>ALPHA
    </div>
  </div>
);

// ... (Rest of the Dashboard Component logic to include setActiveTab('id-hub'))