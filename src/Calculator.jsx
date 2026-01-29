import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calculator as CalcIcon, ArrowRight, 
  BrickWall, Layers, Grid3X3, RotateCcw
} from 'lucide-react';

const TABS = [
  { id: 'wall', label: 'Brick Wall', icon: <BrickWall size={18} /> },
  { id: 'slab', label: 'RCC Slab', icon: <Layers size={18} /> },
  { id: 'floor', label: 'Flooring', icon: <Grid3X3 size={18} /> },
];

export default function Calculator({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('wall');
  
  // Inputs
  const [length, setLength] = useState('');
  const [width, setWidth] = useState(''); // Used as Height for wall
  const [thickness, setThickness] = useState(6); // Slab thickness (inch)
  const [wallType, setWallType] = useState(9); // 9" or 4"
  
  const [result, setResult] = useState(null);

  const reset = () => {
    setResult(null);
    setLength('');
    setWidth('');
  };

  const calculate = () => {
    const L = parseFloat(length) || 0;
    const W = parseFloat(width) || 0; // Height for Wall
    
    if (L === 0 || W === 0) return;

    let res = {};

    if (activeTab === 'wall') {
      // --- BRICKWORK CALCULATION ---
      // Standard: 1 cum = 500 bricks. 
      // 9" Wall (1:6 Mortar)
      
      const areaSqFt = L * W;
      const volCuFt = wallType === 9 ? areaSqFt * 0.75 : areaSqFt * 0.33; // 9" = 0.75ft, 4" = 0.33ft
      
      // Bricks: Approx 13.5 bricks per cu.ft for 9" wall
      const totalBricks = Math.ceil(volCuFt * 13.5);
      
      // Mortar (Dry Vol) is approx 30% of wall volume
      const dryMortarVol = volCuFt * 0.30;
      
      // Ratio 1:6 (Cement : Sand) -> Sum = 7
      const cementVol = dryMortarVol * (1/7);
      const sandVol = dryMortarVol * (6/7);
      
      // Convert to Bags (1 Bag = 1.226 cu.ft)
      const cementBags = Math.ceil(cementVol / 1.226);
      
      res = {
        main: { label: "Total Bricks", value: totalBricks, unit: "pcs" },
        sec1: { label: "Cement", value: cementBags, unit: "bags" },
        sec2: { label: "Sand", value: sandVol.toFixed(1), unit: "cu.ft" },
        sec3: { label: "Wall Area", value: areaSqFt, unit: "sq.ft" }
      };

    } else if (activeTab === 'slab') {
      // --- RCC SLAB CALCULATION (M20 Grade - 1:1.5:3) ---
      // Dry Volume = Wet Volume * 1.54
      
      const areaSqFt = L * W;
      const thickFt = thickness / 12;
      const wetVol = areaSqFt * thickFt;
      const dryVol = wetVol * 1.54;
      
      // Ratio Sum = 1 + 1.5 + 3 = 5.5
      const cementVol = dryVol * (1 / 5.5);
      const sandVol = dryVol * (1.5 / 5.5);
      const aggVol = dryVol * (3 / 5.5);
      
      // Steel: Approx 1% of Wet Volume (Density 7850 kg/m3)
      // 1 cu.ft = 0.0283 cu.m
      const wetVolCum = wetVol * 0.0283;
      const steelKg = wetVolCum * 7850 * 0.01; // 1% steel
      
      const cementBags = Math.ceil(cementVol / 1.226);
      
      res = {
        main: { label: "Cement", value: cementBags, unit: "bags" },
        sec1: { label: "Sand", value: sandVol.toFixed(1), unit: "cu.ft" },
        sec2: { label: "Aggregate", value: aggVol.toFixed(1), unit: "cu.ft" },
        sec3: { label: "Steel (Approx)", value: Math.ceil(steelKg), unit: "kg" }
      };

    } else if (activeTab === 'floor') {
      // --- FLOORING (Tiles) ---
      const area = L * W;
      // Add 10% wastage
      const totalArea = Math.ceil(area * 1.1);
      // Approx 2x2 vitrified tile = 4 sq.ft
      const tiles = Math.ceil(totalArea / 4);
      // Cement Bedding (Avg 1.5 inch thick)
      const cementBags = Math.ceil(area / 100); // Rough rule: 1 bag per 100 sqft

      res = {
        main: { label: "Total Tiles", value: tiles, unit: "pcs (2x2)" },
        sec1: { label: "Total Area", value: totalArea, unit: "sq.ft (+10%)" },
        sec2: { label: "Cement", value: cementBags, unit: "bags" },
        sec3: { label: "White Cement", value: Math.ceil(area/500), unit: "kg" }
      };
    }

    setResult(res);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[32px] z-50 shadow-2xl h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 pb-8 rounded-b-[32px] shadow-sm z-10">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <CalcIcon className="text-orange-600" /> Calculator
                  </h2>
                  <p className="text-xs text-gray-500">Professional estimation tool.</p>
                </div>
                <button onClick={onClose} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-inner">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); reset(); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? "bg-orange-600 text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* --- Inputs --- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Length (ft)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-mono text-xl font-bold outline-none focus:ring-2 focus:ring-orange-500 text-center"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    {activeTab === 'wall' ? 'Height (ft)' : 'Width (ft)'}
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-mono text-xl font-bold outline-none focus:ring-2 focus:ring-orange-500 text-center"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Specific Options based on Tab */}
              {activeTab === 'wall' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Wall Type</label>
                  <div className="flex gap-3">
                    {[4, 9].map((t) => (
                      <button 
                        key={t}
                        onClick={() => setWallType(t)}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                          wallType === t 
                          ? "border-orange-600 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300" 
                          : "border-gray-100 dark:border-gray-700 text-gray-400"
                        }`}
                      >
                        {t}" Inch
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'slab' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Slab Thickness</label>
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                    <input 
                      type="range" min="4" max="10" step="0.5" 
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      className="w-full accent-orange-600"
                    />
                    <span className="font-mono font-bold text-lg w-16 text-right">{thickness}"</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={reset}
                  className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500"
                >
                  <RotateCcw size={24} />
                </button>
                <button 
                  onClick={calculate}
                  className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  Calculate <ArrowRight size={20} />
                </button>
              </div>

              {/* --- Results --- */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-blue-600 text-white rounded-[24px] p-6 shadow-xl shadow-blue-900/20 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Grid3X3 size={100} />
                    </div>

                    <div className="relative z-10 text-center mb-6">
                      <div className="text-xs font-medium opacity-80 uppercase tracking-widest mb-1">Estimated Requirement</div>
                      <div className="text-5xl font-black tracking-tighter">{result.main.value}</div>
                      <div className="text-sm font-bold opacity-90">{result.main.label} ({result.main.unit})</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 relative z-10">
                      {[result.sec1, result.sec2, result.sec3].map((item, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                          <div className="text-lg font-bold">{item.value}</div>
                          <div className="text-[10px] opacity-70 leading-tight">{item.label}</div>
                          <div className="text-[9px] opacity-50">{item.unit}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}