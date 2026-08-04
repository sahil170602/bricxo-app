import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';

// --- PAGE IMPORTS ---
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Calculator from './pages/Calculator';
import AdminDashboard from './AdminDashboard'; 
import AiDesignResults from './pages/AiDesignResults'; // <-- Added AI Results import

// --- ASSETS ---
import appIcon from './assets/icon.png';

// --- SPLASH SCREEN COMPONENT ---
const SplashScreen = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
  >
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="w-32 h-32 mb-4"
    >
      <img src={appIcon} alt="Bricxo Icon" className="w-full h-full object-contain rounded-3xl shadow-lg" />
    </motion.div>
    <div className="absolute bottom-65">
      <h1 className="text-2xl font-black tracking-[0.3em] text-slate-900">BRICXO</h1>
      <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Materials & More</p>
    </div>
  </motion.div>
);

// --- LOGIN SCREEN COMPONENT ---
const LoginScreen = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({p:'', n:'', a:''});
  const [loading, setLoading] = useState(false);

  const go = async () => {
    if (!f.p) return;
    setLoading(true);
    try {
      if(step === 1) {
        const { data } = await supabase.from('users').select('*').eq('phone', f.p).single();
        if(data) onLogin(data); else setStep(2);
      } else {
        if (!f.n || !f.a) return;
        await supabase.from('users').insert([{phone:f.p, name:f.n, address:f.a}]);
        onLogin({phone:f.p, name:f.n, address:f.a});
      }
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 text-center z-[80]">
      <div className="w-20 h-20 mb-6">
        <img src={appIcon} className="w-full h-full object-contain rounded-2xl shadow-xl" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Bricxo</h1>
      
      <div className="w-full max-w-xs space-y-4">
        {step === 1 ? (
          <input 
            type="tel" 
            value={f.p} 
            onChange={e=>setF({...f, p:e.target.value})} 
            placeholder="Mobile Number" 
            className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 outline-none text-center font-bold" 
          />
        ) : (
          <>
            <input 
              value={f.n} 
              onChange={e=>setF({...f, n:e.target.value})} 
              placeholder="Full Name" 
              className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 outline-none font-bold" 
            />
            <textarea 
              value={f.a} 
              onChange={e=>setF({...f, a:e.target.value})} 
              placeholder="Address" 
              className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 outline-none font-bold resize-none" 
              rows="2" 
            />
          </>
        )}
        
        <button 
          onClick={go} 
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 shadow-xl disabled:opacity-70 transition-all"
        >
          {loading ? "Please Wait..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() { 
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize App & Check Auth
  useEffect(() => {
    // 1. Splash Screen Timer
    const timer = setTimeout(() => setShowSplash(false), 2500);
    
    // 2. Check for existing session
    const sessionPhone = localStorage.getItem('bricxo_session_phone');
    if(sessionPhone) { 
      supabase.from('users').select('*').eq('phone', sessionPhone).single()
        .then(({data}) => { 
          if(data) setUser(data); 
        })
        .catch(err => console.error("Session check failed:", err)); 
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    setUser(null); 
    localStorage.removeItem('bricxo_session_phone');
  };

  // Render sequence
  if (showSplash) {
    return <SplashScreen />;
  }
  
  if (!user) {
    return (
      <LoginScreen onLogin={(u) => { 
        setUser(u); 
        localStorage.setItem('bricxo_session_phone', u.phone); 
      }} />
    );
  }

  // Routing Configuration (No Bottom Nav, No Orders Page)
  return ( 
    <AnimatePresence mode="wait">
      <Routes> 
        <Route path="/" element={<HomePage />} /> 
        <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        {/* <-- Added AI Results Route here --> */}
        <Route path="/ai-designs" element={<AiDesignResults />} /> 
      </Routes>
    </AnimatePresence> 
  ); 
}
