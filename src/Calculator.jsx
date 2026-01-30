import React, { useState } from 'react';
import { Calculator as CalcIcon, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Calculator() {
  const [area, setArea] = useState(''); 
  const [stage, setStage] = useState('ground'); 
  const [result, setResult] = useState(null);

  const calculateAll = () => {
    if (!area || Number(area) <= 0) return;
    const sqft = Number(area);

    // --- CONSUMPTION CONSTANTS (Per Sq. Ft) ---
    const foundation = { cement: 0.40, steel: 2.5, sand: 1.6, agg: 2.2, bricks: 0 };
    const perFloor = { cement: 0.45, steel: 3.5, sand: 1.9, agg: 1.35, bricks: 14 };

    let multFoundation = 0;
    let multFloors = 0;

    switch (stage) {
      case 'foundation': multFoundation = 1; multFloors = 0; break;
      case 'ground':     multFoundation = 1; multFloors = 1; break;
      case 'first':      multFoundation = 1; multFloors = 2; break;
      case 'second':     multFoundation = 1; multFloors = 3; break;
      case 'terrace':    multFoundation = 1; multFloors = 4; break;
      default:           multFoundation = 1; multFloors = 1;
    }

    const totalCement = (sqft * foundation.cement * multFoundation) + (sqft * perFloor.cement * multFloors);
    const totalSteel = (sqft * foundation.steel * multFoundation) + (sqft * perFloor.steel * multFloors);
    const totalSand = (sqft * foundation.sand * multFoundation) + (sqft * perFloor.sand * multFloors);
    const totalAgg = (sqft * foundation.agg * multFoundation) + (sqft * perFloor.agg * multFloors);
    const totalBricks = (sqft * foundation.bricks * multFoundation) + (sqft * perFloor.bricks * multFloors);

    setResult([
      { label: 'Cement', value: Math.ceil(totalCement).toString(), unit: 'Bags', color: 'bg-blue-50 text-blue-600' },
      { label: 'TMT Steel', value: (totalSteel / 1000).toFixed(2), unit: 'Tons', color: 'bg-orange-50 text-orange-600' },
      { label: 'Sand', value: Math.ceil(totalSand).toString(), unit: 'Cu.Ft', color: 'bg-yellow-50 text-yellow-600' },
      { label: 'Aggregate', value: Math.ceil(totalAgg).toString(), unit: 'Cu.Ft', color: 'bg-gray-50 text-gray-600' },
      { label: 'Bricks', value: Math.ceil(totalBricks).toString(), unit: 'Pcs', color: 'bg-red-50 text-red-600' },
    ]);
  };

  return (
    <div className="p-4 pb-32">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white dark:bg-slate-800 w-full rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden"
      >
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 bg-orange-100 dark:bg-orange-900/20 w-32 h-32 rounded-bl-full -mr-8 -mt-8 z-0"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 text-white p-3 rounded-2xl shadow-lg shadow-orange-500/30">
                <CalcIcon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none">Estimator</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Material Calculator</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Included Levels</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'foundation', label: 'Foundation Only' },
                  { id: 'ground', label: 'Upto Ground Flr' },
                  { id: 'first', label: 'Upto 1st Floor' },
                  { id: 'second', label: 'Upto 2nd Floor' },
                  { id: 'terrace', label: 'Upto Terrace (G+3)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setStage(opt.id)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                      stage === opt.id 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-slate-900' 
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-100'
                    } ${opt.id === 'terrace' ? 'col-span-2' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Plot Area (Sq. Ft)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={area} 
                  onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))} 
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl font-black text-3xl text-slate-900 dark:text-white outline-none focus:ring-2 ring-orange-500/20 border border-gray-100 dark:border-slate-700 transition-all placeholder-gray-300" 
                  placeholder="0" 
                />
                <span className="absolute right-4 top-5 text-sm font-bold text-gray-400">FT²</span>
              </div>
            </div>
          </div>

          <button onClick={calculateAll} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-xl mb-6">
            Calculate <ArrowRight size={18} />
          </button>

          {/* Results Area */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">Total Estimate</h3>
                  <button onClick={() => {setArea(''); setResult(null);}} className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg hover:bg-orange-100">
                    <RefreshCw size={10} /> RESET
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {result.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${item.color.split(' ')[0]}`}></div>
                        <div>
                          <span className="block font-bold text-slate-700 dark:text-slate-200 text-sm">{item.label}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{item.unit}</span>
                        </div>
                      </div>
                      <span className="block font-black text-xl text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
                   <div className="text-blue-600 dark:text-blue-400"><span className="text-xs font-bold font-mono">i</span></div>
                   <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-tight font-medium">
                     Calculated cumulatively from Foundation level up to the selected floor.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}