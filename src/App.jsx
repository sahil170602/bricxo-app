import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Package, Search, Truck, Calculator as CalculatorIcon,
  X, ArrowLeft, ShoppingCart, Plus, Minus, MapPin, UserCircle, LogOut, 
  Phone, MessageCircle, ChevronRight, Play, LifeBuoy,
  Construction, Moon, Sun, CheckCircle, CreditCard, Settings, Box
} from 'lucide-react';
import { supabase } from './supabaseClient';

import Calculator from './Calculator';
import AdminDashboard from './AdminDashboard';

// --- ASSET IMPORTS ---
import sandImg from './assets/sand.png'; 
import bricksImg from './assets/bricks.png';
import aggregatesImg from './assets/aggregates.png';
import cementImg from './assets/cement.png';
import tmtImg from './assets/tmt.png';
import investorImg from './assets/investor.png';
import appIcon from './assets/icon.png'; // Used for Splash Screen
import adVideo from './assets/ad.mp4'; 

const OWNER_PHONE_NUMBER = "917972506748"; 

// --- STATIC DATA ---
const MAIN_MATERIALS = [
  { id: 'sand', name: 'Sand', image: sandImg },
  { id: 'bricks', name: 'Bricks', image: bricksImg },
  { id: 'aggregates', name: 'Aggregates', image: aggregatesImg },
  { id: 'cement', name: 'Cement', image: cementImg },
];

const TMT_BAR_IMG = tmtImg;
const INVESTOR_IMG = investorImg;

// --- COMPONENTS ---

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

const GlobalHeader = ({ title, cartCount, onCartClick, searchQuery, setSearchQuery, isSubPage = false, onBack }) => (
  <div 
    className="absolute top-0 left-0 right-0 flex flex-col gap-2 px-4 pb-3 bg-white z-50 border-b border-slate-100 shadow-sm transition-colors duration-300"
    style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
  >
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        {isSubPage && <button onClick={onBack} className="p-1 hover:bg-slate-50 rounded-full transition-colors"><ArrowLeft size={20} className="text-slate-900"/></button>}
        <h1 className="text-xl font-black tracking-tighter text-orange-500 uppercase">
          {title || "BRICXO"}
        </h1>
      </div>
      <button onClick={onCartClick} className="relative p-2 text-slate-600">
        <ShoppingCart size={22} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  </div>
);

const VideoBanner = () => (
  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md mt-4 bg-slate-200">
    <video 
      className="w-full h-full object-cover"
      autoPlay 
      muted 
      loop 
      playsInline
    >
      <source src={adVideo} type="video/mp4" />
    </video>
    <div className="absolute inset- bg-black/20 flex flex-col justify-end p-0">
      <div className="flex items-center gap-2">
       
        <span className="text-white font-black text-[10px] uppercase tracking-widest"></span>
      </div>
    </div>
  </div>
);

// --- MAIN CONTENT CARDS ---

const MainMaterialCard = ({ item, onQuote }) => (
  <motion.div whileTap={{ scale: 0.98 }} onClick={() => onQuote(item.name)} className="relative rounded-xl overflow-hidden shadow-sm h-22 cursor-pointer group bg-gray-900">
    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90" />
    <div className="absolute bottom-0 w-full bg-white py-1 px-3 flex justify-between items-center">
      <span className="text-slate-900 font-bold text-sm">{item.name}</span>
      <div className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Get Quote</div>
    </div>
  </motion.div>
);

const TmtCard = ({ onQuote }) => (
  <motion.div whileTap={{ scale: 0.98 }} onClick={() => onQuote('TMT Bars')} className="bg-blue-50 rounded-xl overflow-hidden shadow-sm relative mt-3 h-16 flex items-center cursor-pointer border border-blue-100">
    <div className="w-1/2 p-4 z-10">
      <h3 className="text-slate-900 font-black text-lg italic">TMT Bars</h3>
      <span className="inline-block mt-1 bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Get Quote</span>
    </div>
    <div className="absolute right-0 top-0 h-full w-2/3">
      <img src={TMT_BAR_IMG} className="w-full h-full object-cover opacity-90" style={{clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)'}} />
    </div>
  </motion.div>
);

const InvestorCard = ({ onOpen }) => (
  <motion.div whileTap={{ scale: 0.98 }} onClick={onOpen} className="bg-slate-900 p-1 rounded-2xl mt-4 shadow-lg cursor-pointer">
    <div className="bg-white rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
          <img src={INVESTOR_IMG} className="w-full h-full rounded-full object-cover border-2 border-white" />
        </div>
        <div><h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Real Estate</h3><p className="text-[10px] text-gray-500 font-medium italic"></p></div>
      </div>
    </div>
  </motion.div>
);

const ProductGrid = ({ products, qtyHelper, updateQty }) => {
  return (
    <div className="grid grid-cols-2 gap-3 pb-32 p-4">
      {products.map(p => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="aspect-square mb-2 bg-slate-50 rounded-xl flex items-center justify-center p-2 overflow-hidden">
            {p.image ? <img src={p.image} className="w-full h-full object-contain" /> : <Package className="text-slate-200" size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight mb-2 h-8">{p.name}</h3>
            <div className="flex justify-between items-center">
              <span className="text-orange-500 text-[9px] font-black uppercase">ADD</span>
              {qtyHelper(p.id) === 0 ? (
                <button onClick={() => updateQty(p, 1)} className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Plus size={14} /></button>
              ) : (
                <div className="flex items-center bg-slate-900 rounded-full p-0.5 h-7">
                  <button onClick={() => updateQty(p, -1)} className="w-5 h-full text-white"><Minus size={10} /></button>
                  <span className="text-[10px] font-bold text-white w-4 text-center">{qtyHelper(p.id)}</span>
                  <button onClick={() => updateQty(p, 1)} className="w-5 h-full text-white"><Plus size={10} /></button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- MAIN APP ---

const UserApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); 
  const [subView, setSubView] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trackedOrder, setTrackedOrder] = useState(null); 

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => setShowSplash(false), 2500);
    
    const sessionPhone = localStorage.getItem('bricxo_session_phone');
    if(sessionPhone) { supabase.from('users').select('*').eq('phone', sessionPhone).single().then(({data}) => { if(data) setUser(data); }); }
    
    const fetchData = async () => { 
      const { data: prodData } = await supabase.from('products').select('*'); 
      const { data: catData } = await supabase.from('categories').select('*'); 
      if(prodData) setProducts(prodData); if(catData) setCategories(catData); 
    };
    fetchData();
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateQty = (product, delta) => {
    setCart(prev => { 
      const existing = prev.find(item => item.id === product.id); 
      if (existing) {
        const newQty = existing.qty + delta; 
        return newQty <= 0 ? prev.filter(item => item.id !== product.id) : prev.map(item => item.id === product.id ? { ...item, qty: newQty } : item); 
      }
      return delta > 0 ? [...prev, { ...product, qty: 1 }] : prev; 
    });
  };

  const handleQuote = (item) => window.open(`https://wa.me/${OWNER_PHONE_NUMBER}?text=Hi Bricxo, I need a quote for *${item}*.`, '_blank');
  const mainMaterialNames = ['Sand', 'Bricks', 'Aggregates', 'Cement', 'TMT Bars'];
  const shopCategories = categories.filter(c => !mainMaterialNames.some(m => c.name.includes(m)));

  if (showSplash) return <SplashScreen />;
  if (!user) return <LoginScreen onLogin={(u) => { setUser(u); localStorage.setItem('bricxo_session_phone', u.phone); }} />;

  // --- SUB-PAGES ROUTING ---
  if (view === 'cart') return <CartView cart={cart} updateQty={handleUpdateQty} onBack={() => setView('home')} onCheckout={() => setView('checkout')} />;
  if (view === 'checkout') return <CheckoutFlow cart={cart} user={user} onClose={() => setView('cart')} onComplete={() => { setCart([]); setView('orders'); }} />;
  if (view === 'tracking') return <TrackingView order={trackedOrder} onBack={() => setView('orders')} />;

  return (
    <div className="fixed inset-0 w-full h-full bg-white flex flex-col transition-colors duration-300">
      
      <GlobalHeader 
        title={subView === 'product-list' ? selectedCategory : (view === 'home' ? "BRICXO" : view.toUpperCase())} 
        isSubPage={!!subView}
        onBack={() => setSubView(null)}
        cartCount={cart.reduce((a,b)=>a+b.qty,0)} 
        onCartClick={() => setView('cart')} 
      />
      
      <div className="flex-1 overflow-y-auto no-scrollbar relative" 
           style={{ paddingTop: 'calc(65px + env(safe-area-inset-top))' }}>
        
        {subView === 'product-list' ? (
          <ProductGrid products={products.filter(p => p.category === selectedCategory)} qtyHelper={(id) => cart.find(i=>i.id===id)?.qty || 0} updateQty={handleUpdateQty} />
        ) : (
          <>
            {view === 'home' && (
              <div className="px-4 pb-32">
                
                {/* 1. AUTO-PLAYING VIDEO FIRST */}
                <VideoBanner />

                {/* 2. MAIN MATERIALS SECOND */}
                <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-3 mt-8">Main Materials</h2>
                <div className="grid grid-cols-2 gap-3">
                  {MAIN_MATERIALS.map(m => (<MainMaterialCard key={m.id} item={m} onQuote={handleQuote} />))}
                </div>
                <TmtCard onQuote={handleQuote} />
                
                {/* 3. REAL ESTATE THIRD */}
                <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-3 mt-8">Real Estate</h2>
                <InvestorCard onOpen={() => setSubView('investor')} />

                {/* 4. SHOP PRODUCTS FOURTH */}
                <div className="mt-8">
                  <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-3">Shop Products</h2>
                  <div className="grid grid-cols-3 gap-3 pb-4">
                    {shopCategories.map(cat => (
                      <div key={cat.id} onClick={() => { setSelectedCategory(cat.name); setSubView('product-list'); }} className="relative h-24 bg-slate-50 rounded-xl shadow-sm border border-slate-100 cursor-pointer overflow-hidden active:scale-95 transition-all">
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-2xl pb-4">
                           {cat.icon && (cat.icon.startsWith('data') || cat.icon.startsWith('http')) ? (
                             <img src={cat.icon} className="w-full h-full object-cover" alt={cat.name} />
                           ) : (<span>{cat.icon || '📦'}</span>)}
                        </div>
                        <div className="absolute bottom-0 w-full bg-white/90 p-1 border-t border-slate-100">
                          <span className="block text-center text-[8px] font-black text-slate-900 truncate uppercase tracking-tighter">{cat.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {view === 'calculator' && <Calculator />}
            {view === 'orders' && <OrdersPage user={user} onTrack={(order) => { setTrackedOrder(order); setView('tracking'); }} />}
            {view === 'account' && <AccountView user={user} onLogout={() => { setUser(null); localStorage.clear(); setView('home'); }} toggleTheme={() => {}} />}
          </>
        )}
      </div>

      <InvestorModal isOpen={subView === 'investor'} onClose={() => setSubView(null)} />
      
      {/* Bottom Nav */}
      <div className="bg-white border-t border-slate-100 flex justify-around py-2 h-[65px] fixed bottom-0 w-full shadow-lg z-40">
        <NavButton icon={<Home size={20} />} label="Home" active={view === 'home'} onClick={() => { setView('home'); setSubView(null); }} />
        <NavButton icon={<CalculatorIcon size={20} />} label="Calc" active={view === 'calculator'} onClick={() => { setView('calculator'); setSubView(null); }} />
        <NavButton icon={<Package size={20} />} label="Orders" active={view === 'orders'} onClick={() => { setView('orders'); setSubView(null); }} />
        <NavButton icon={<UserCircle size={20} />} label="Account" active={view === 'account'} onClick={() => { setView('account'); setSubView(null); }} />
      </div>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-full transition-all ${active ? 'text-orange-500 scale-110' : 'text-slate-400'}`}>
    {icon}<span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

const OrdersPage = ({ user, onTrack }) => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('live'); 
  useEffect(() => {
    supabase.from('orders').select('*').eq('user_phone', user.phone).order('timestamp', { ascending: false }).then(({data}) => { if (data) setOrders(data); });
  }, [user]);
  const live = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const past = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-4 pb-4 bg-white shadow-sm z-10">
        <div className="flex bg-slate-100 p-1 rounded-xl mt-2">
          <button onClick={() => setTab('live')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${tab === 'live' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Live Orders</button>
          <button onClick={() => setTab('history')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${tab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>History</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {(tab === 'live' ? live : past).map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
            <div className="flex justify-between mb-2">
              <span className="text-[9px] font-black text-slate-300 uppercase">#{order.id.split('-')[1]}</span>
              <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{order.status}</span>
            </div>
            {tab === 'live' && <button onClick={() => onTrack(order)} className="w-full bg-slate-900 text-white py-2 rounded-lg font-black text-[10px] uppercase tracking-widest">Track Status</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({p:'', n:'', a:''});
  const go = async () => {
    if(step === 1) {
      const { data } = await supabase.from('users').select('*').eq('phone', f.p).single();
      if(data) onLogin(data); else setStep(2);
    } else {
      await supabase.from('users').insert([{phone:f.p, name:f.n, address:f.a}]);
      onLogin({phone:f.p, name:f.n, address:f.a});
    }
  };
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 text-center z-[80]">
      <div className="w-20 h-20 mb-6"><img src={appIcon} className="w-full h-full object-contain rounded-2xl shadow-xl" /></div>
      <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Bricxo</h1>
      <div className="w-full max-w-xs space-y-4">
        {step === 1 ? (
          <input type="tel" value={f.p} onChange={e=>setF({...f, p:e.target.value})} placeholder="Mobile Number" className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 outline-none text-center font-bold" />
        ) : (
          <><input value={f.n} onChange={e=>setF({...f, n:e.target.value})} placeholder="Full Name" className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 outline-none font-bold" />
            <textarea value={f.a} onChange={e=>setF({...f, a:e.target.value})} placeholder="Address" className="w-full p-4 bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 outline-none font-bold resize-none" rows="2" /></>
        )}
        <button onClick={go} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 shadow-xl">Continue</button>
      </div>
    </div>
  );
};

// ... Remaining Views (Cart, Checkout, Tracking, Account, InvestorModal) exactly as per previous stable logic
const CartView = ({ cart, updateQty, onBack, onCheckout }) => (
  <div className="h-full flex flex-col bg-slate-50">
    <GlobalHeader title="My Cart" isSubPage={true} onBack={onBack} cartCount={0} />
    <div className="flex-1 overflow-y-auto p-4 pb-32" style={{ paddingTop: 'calc(70px + env(safe-area-inset-top))' }}>
      {cart.length === 0 ? <div className="text-center py-20 opacity-40 flex flex-col items-center gap-2"><ShoppingCart size={40}/><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Cart is empty</p></div> : (
        <div className="space-y-3">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-slate-100">
              <div><h4 className="font-bold text-slate-900 text-sm">{item.name}</h4><p className="text-[10px] text-slate-500 font-bold uppercase">Qty: {item.qty}</p></div>
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button onClick={() => updateQty(item, -1)} className="p-1.5 text-slate-500"><Minus size={12} /></button>
                <span className="w-6 text-center font-bold text-xs text-slate-900">{item.qty}</span>
                <button onClick={() => updateQty(item, 1)} className="p-1.5 text-slate-500"><Plus size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    {cart.length > 0 && <div className="p-4 bg-white border-t border-slate-100 fixed bottom-0 w-full z-50 shadow-2xl">
      <button onClick={onCheckout} className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 shadow-lg shadow-orange-200">Checkout</button>
    </div>}
  </div>
);

const CheckoutFlow = ({ cart, user, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const placeOrder = async () => {
    setLoading(true);
    try {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_phone', user.phone);
      const orderId = `${user.phone}-${(count || 0) + 1}`;
      await supabase.from('orders').insert([{ id: orderId, user_phone: user.phone, customer_name: user.name, address: user.address, items: cart, status: 'Pending', payment_mode: 'Cash on Delivery', timestamp: new Date().toISOString() }]);
      setStep(3); setTimeout(onComplete, 2000);
    } catch (e) { alert("Error"); } finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col h-full">
      <GlobalHeader title="Checkout" isSubPage={true} onBack={onClose} cartCount={0} />
      <div className="flex-1 p-6" style={{ paddingTop: 'calc(70px + env(safe-area-inset-top))' }}>
        {step === 1 && (<div className="space-y-6"><div className="bg-slate-50 p-5 rounded-xl border border-slate-100"><h3 className="font-black text-slate-900 text-xs uppercase mb-2">Delivery</h3><p className="text-lg font-bold text-slate-900">{user.name}</p><p className="text-slate-500 text-xs">{user.address}</p></div><button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest active:scale-95 shadow-sm">Confirm Details</button></div>)}
        {step === 2 && (<div className="flex flex-col items-center justify-center h-full text-center space-y-6"><CreditCard size={40} className="text-orange-500" /><h2 className="text-xl font-black text-slate-900 uppercase">Cash on Delivery</h2><button onClick={placeOrder} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-md active:scale-95">{loading ? "Wait..." : "Place Order"}</button></div>)}
        {step === 3 && (<div className="flex flex-col items-center justify-center h-full text-center"><CheckCircle size={50} className="text-green-500 mb-4" /><h2 className="text-2xl font-black text-slate-900 uppercase">Order Placed!</h2></div>)}
      </div>
    </div>
  );
};

const TrackingView = ({ order, onBack }) => (
  <div className="h-full flex flex-col bg-white">
    <GlobalHeader title="Order Status" isSubPage={true} onBack={onBack} cartCount={0} />
    <div className="flex-1 p-8 space-y-8" style={{ paddingTop: 'calc(100px + env(safe-area-inset-top))' }}>
      {['Pending', 'Accepted', 'Transit', 'Delivered'].map((step, idx) => {
        const steps = ['Pending', 'Accepted', 'Out for Delivery', 'Delivered'];
        const active = steps.indexOf(order.status) >= idx;
        return (
          <div key={step} className="flex gap-4 relative">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${active ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
              {active ? <CheckCircle size={12} /> : <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
            </div>
            <p className={`font-black text-xs uppercase tracking-tighter ${active ? 'text-slate-900' : 'text-slate-300'}`}>{step}</p>
          </div>
        );
      })}
    </div>
  </div>
);

const AccountView = ({ user, onLogout, toggleTheme }) => (
  <div className="h-full flex flex-col bg-slate-50">
    <div className="p-4 space-y-6">
      <div className="bg-white p-5 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm mt-2">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-xl shadow-inner">{user.name?.[0].toUpperCase()}</div>
        <div><h3 className="font-black text-slate-900 text-lg">{user.name}</h3><p className="text-xs text-slate-400 font-bold">{user.phone}</p></div>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
         <div className="p-4 flex items-center gap-3 cursor-pointer active:bg-slate-50" onClick={() => window.open(`https://wa.me/${OWNER_PHONE_NUMBER}`)}>
            <MessageCircle className="text-orange-500" size={18}/><span className="font-bold text-slate-700 text-sm">Support Chat</span>
         </div>
      </div>
      <button onClick={onLogout} className="w-full py-3.5 bg-white text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-red-50 active:bg-red-50 transition-colors">Sign Out</button>
    </div>
  </div>
);

const InvestorModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-[60] bg-black text-white flex flex-col h-full">
        <div className="p-4 flex justify-between items-center absolute top-0 w-full z-10" style={{ paddingTop: 'max(20px, env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-3"><img src={INVESTOR_IMG} className="w-9 h-9 rounded-full border border-orange-500" /><div><h3 className="font-bold text-sm text-orange-500 uppercase">Properties</h3><p className="text-[10px] text-gray-400">Video Showcase</p></div></div><button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-scroll snap-y snap-mandatory bg-black">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-full w-full snap-center relative flex items-center justify-center border-b border-white/5">
              <Play size={40} className="text-orange-500/30 z-10 animate-pulse" />
              <img src={`https://images.unsplash.com/photo-1582408921715-18e7806367c1?q=80&w=400&h=800&auto=format&fit=crop&sig=${i}`} className="absolute inset-0 w-full h-full object-cover opacity-40" />
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function App() { return ( <Routes> <Route path="/" element={<UserApp />} /> <Route path="/admin" element={<AdminDashboard />} /> </Routes> ); }
