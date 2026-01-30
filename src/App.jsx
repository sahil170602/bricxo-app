import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Sun, Home, Package, Search, 
  Truck, Calculator as CalculatorIcon,
  X, ArrowLeft, Send, Plus, Minus, MapPin, 
  UserCircle, LogOut, ImageOff, Layers, Filter, LogIn,
  Construction
} from 'lucide-react';
import { supabase } from './supabaseClient';

import Calculator from './Calculator';
import AdminDashboard from './AdminDashboard';

const OWNER_PHONE_NUMBER = "917972506748"; 

// --- Components ---

const Navbar = ({ darkMode, toggleTheme, onOpenCalc }) => (
  // FIXED: Added style to handle Status Bar padding internally
  <div 
    className="absolute top-0 left-0 right-0 flex justify-between items-start px-6 pb-3 bg-slate-900 z-50 border-b border-slate-800 shadow-lg"
    style={{ 
      paddingTop: 'max(12px, env(safe-area-inset-top))', // Pushes text down safely
      height: 'auto',
      minHeight: 'calc(72px + env(safe-area-inset-top))' // Grows to fit status bar
    }}
  >
    <div className="mt-1">
      <h1 className="text-xl font-black tracking-tighter text-orange-500">BRICXO</h1>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Construction Supply</p>
    </div>
    <div className="flex gap-2 mt-1">
      <button onClick={onOpenCalc} className="p-2 rounded-xl bg-slate-800 text-blue-400 hover:bg-slate-700 transition-colors border border-slate-700">
        <CalculatorIcon size={18} />
      </button>
      <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700">
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  </div>
);

const ProductCard = ({ product, qty, onUpdateQty }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-gray-900 p-3 rounded-[24px] shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden group flex flex-col justify-between transition-colors duration-300">
      <div className="h-32 flex items-center justify-center mb-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl transition-colors duration-300">
        {!imgError && product.image ? (
          <img src={product.image} className="w-full h-full object-contain drop-shadow-xl" onError={() => setImgError(true)} alt={product.name} />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300 dark:text-gray-600"><Package size={32} /><span className="text-[10px] font-bold mt-1 uppercase">No Image</span></div>
        )}
      </div>
      <div>
        <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 leading-tight mb-1 line-clamp-2 min-h-[2.5em]">{product.name}</h3>
        <div className="flex justify-between items-end mt-2">
          <div><p className="text-orange-600 font-bold text-xs uppercase tracking-wide">Get Quote</p></div>
          {qty === 0 ? (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => onUpdateQty(product, 1)} className="bg-slate-900 dark:bg-white text-white dark:text-gray-900 w-9 h-9 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Plus size={18} /></motion.button>
          ) : (
            <div className="flex items-center bg-slate-900 dark:bg-white rounded-full p-1 h-9 shadow-lg">
              <button onClick={() => onUpdateQty(product, -1)} className="w-7 h-full flex items-center justify-center text-white dark:text-gray-900"><Minus size={14} /></button>
              <span className="text-xs font-bold text-white dark:text-gray-900 w-4 text-center">{qty}</span>
              <button onClick={() => onUpdateQty(product, 1)} className="w-7 h-full flex items-center justify-center text-white dark:text-gray-900"><Plus size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- SCREENS ---

const LoginScreen = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const checkUser = async () => {
    if(!phone || phone.length < 10) return alert("Enter valid phone");
    setLoading(true);
    const { data, error } = await supabase.from('users').select('*').eq('phone', phone).single();
    if(data) { onLogin(data); } else { setStep(2); }
    setLoading(false);
  };

  const registerUser = async () => {
    if(!name || !address) return alert("Fill details");
    setLoading(true);
    const newUser = { phone, name, address };
    const { error } = await supabase.from('users').insert([newUser]);
    if(!error) onLogin(newUser);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center z-[60]">
      <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-slate-700 shadow-orange-500/10"><Construction size={48} className="text-orange-500" /></div>
      <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome to BRICXO</h1>
      <p className="text-slate-400 mb-10 text-sm font-medium">Your construction materials partner.</p>
      <div className="w-full max-w-sm space-y-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-sm">
        {step === 1 && (
          <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}}>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block text-left ml-1">Mobile Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none focus:border-orange-500 text-lg font-bold text-center placeholder-slate-600 transition-colors" />
            <button onClick={checkUser} disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold mt-4 shadow-lg hover:bg-orange-500 active:scale-95 transition-all">{loading ? "Checking..." : "Continue"}</button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-4">
            <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block text-left ml-1">Full Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none placeholder-slate-600 focus:border-orange-500" /></div>
            <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block text-left ml-1">Delivery Address</label><textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="House No, Street, City..." className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none placeholder-slate-600 focus:border-orange-500 resize-none" rows="3"></textarea></div>
            <button onClick={registerUser} disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-500 active:scale-95 transition-all">{loading ? "Creating..." : "Start Ordering"}</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const HomePage = ({ products, qtyHelper, updateQty }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const featuredProducts = products.filter(p => p.featured);
  const filteredProducts = featuredProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    // FIXED: Padding top calculation ensures content starts below the safe-area header
    <div className="h-full overflow-y-auto pb-32 no-scrollbar" style={{ paddingTop: 'calc(90px + env(safe-area-inset-top))' }}>
      <div className="px-6 mt-2 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search featured items..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm transition-all text-gray-900 dark:text-white" />
        </div>
      </div>
      <div className="px-6">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-slate-800 dark:text-white">Featured Products <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-[10px] px-2 py-1 rounded-full">HOT</span></h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.length > 0 ? filteredProducts.map(p => (<ProductCard key={p.id} product={p} qty={qtyHelper(p.id)} onUpdateQty={updateQty} />)) : <div className="col-span-2 text-center text-gray-400 py-10 italic">No featured products found.</div>}
        </div>
      </div>
    </div>
  );
};

const CatalogPage = ({ products, categories, qtyHelper, updateQty }) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const sortedProducts = [...products].sort((a, b) => b.id - a.id);
  const filteredProducts = sortedProducts.filter(p => { const matchesCategory = filter === 'All' || p.category === filter; const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()); return matchesCategory && matchesSearch; });

  return (
    <div className="h-full w-full relative">
      {/* FIXED HEADER: Padding Top handles Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 px-4 shadow-lg transition-colors duration-300"
           style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', height: 'auto', paddingBottom: '12px' }}>
        <div className="flex justify-between items-center mb-3 mt-1">
           <h2 className="text-lg font-black px-2 text-white">All Products</h2>
           <div className="relative w-48">
              <Search className="absolute left-3 top-2 text-slate-400" size={14} />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none text-xs focus:border-orange-500 transition-colors" />
           </div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setFilter('All')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filter === 'All' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>All Items</button>
          {categories.map(cat => (<button key={cat.id} onClick={() => setFilter(cat.name)} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filter === cat.name ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{cat.name}</button>))}
        </div>
      </div>

      {/* FIXED BODY PADDING */}
      <div className="h-full overflow-y-auto pb-32 px-6 no-scrollbar" style={{ paddingTop: 'calc(130px + env(safe-area-inset-top))' }}>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.length > 0 ? filteredProducts.map(p => (<ProductCard key={p.id} product={p} qty={qtyHelper(p.id)} onUpdateQty={updateQty} />)) : <div className="col-span-2 text-center text-gray-400 py-10 mt-10">No products found.</div>}
        </div>
      </div>
    </div>
  );
};

const AccountPage = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchHistory = async () => { if(user?.phone) { const { data } = await supabase.from('orders').select('*').eq('user_phone', user.phone).order('timestamp', { ascending: false }); if(data) setOrders(data); } };
    fetchHistory();
  }, [user]);

  return (
    <div className="h-full relative w-full">
      <div className="absolute top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 px-6 shadow-lg flex items-center transition-colors duration-300"
           style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', height: 'auto', paddingBottom: '12px' }}>
        <h2 className="text-lg font-black text-white mt-1">My Account</h2>
      </div>

      <div className="h-full overflow-y-auto pb-32 px-6 no-scrollbar" style={{ paddingTop: 'calc(80px + env(safe-area-inset-top))' }}>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl mb-6 text-center border border-gray-100 dark:border-gray-800 shadow-sm mt-2 transition-colors duration-300">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600 text-3xl font-bold shadow-inner">{user.name ? user.name[0] : <UserCircle size={40} />}</div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">{user.name}</h3>
          <p className="text-xs text-gray-500">{user.phone}</p>
          <p className="text-xs text-gray-400 mt-1">{user.address}</p>
        </div>
        <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 ml-1">Order History</h4>
        <div className="space-y-3">
          {orders.length === 0 ? <p className="text-sm text-gray-400 italic text-center py-4">No past orders.</p> : orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm transition-colors duration-300">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-sm text-orange-600">Order #{order.id.split('-')[1]}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>{order.status}</span>
              </div>
              <p className="text-xs text-gray-500">{order.items.length} Items • {new Date(order.timestamp).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        <button onClick={onLogout} className="mt-8 flex items-center justify-center gap-3 w-full p-4 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/10 font-bold transition-colors hover:bg-red-100"><LogOut size={20} /> Sign Out</button>
      </div>
    </div>
  );
};

const TrackingPage = ({ user }) => {
  const [activeOrder, setActiveOrder] = useState(null);
  useEffect(() => {
    const fetchActive = async () => { const { data } = await supabase.from('orders').select('*').eq('user_phone', user.phone).neq('status', 'Delivered').order('timestamp', { ascending: false }).limit(1).single(); if(data) setActiveOrder(data); };
    fetchActive();
    const interval = setInterval(fetchActive, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="h-full relative bg-gray-50 dark:bg-gray-900 w-full overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 z-30 w-full bg-slate-900 border-b border-slate-800 px-6 shadow-lg flex items-center transition-colors duration-300"
           style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', height: 'auto', paddingBottom: '12px' }}>
        <h2 className="text-lg font-black text-white mt-1">Track Order</h2>
      </div>

      <div className="absolute inset-0 bg-[#e5e7eb] dark:bg-[#1f2937] overflow-hidden pb-[80px]" style={{ paddingTop: 'calc(60px + env(safe-area-inset-top))' }}>
        {activeOrder ? (
          <>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="none">
              <path id="roadPath" d="M 200 550 C 100 500, 50 400, 150 300 S 350 200, 200 100" fill="none" stroke="#9ca3af" strokeWidth="20" strokeLinecap="round" />
              <path d="M 200 550 C 100 500, 50 400, 150 300 S 350 200, 200 100" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 10" className="dark:stroke-gray-800" />
              {activeOrder.status === 'Out for Delivery' && <circle r="8" fill="#ea580c"><animateMotion dur="10s" repeatCount="indefinite" rotate="auto"><mpath href="#roadPath" /></animateMotion></circle>}
              <g transform="translate(190, 530)"><circle r="12" fill="#10b981" /><text x="20" y="5" className="text-[10px] font-bold fill-gray-600 dark:fill-gray-300">Warehouse</text></g>
              <g transform="translate(190, 90)"><MapPin size={24} className="text-red-600" fill="currentColor" /><text x="25" y="15" className="text-[10px] font-bold fill-gray-600 dark:fill-gray-300">You</text></g>
            </svg>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm"><Package size={40} className="text-gray-400" /></div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Active Deliveries</h3>
            <p className="text-gray-500 mt-2 text-sm max-w-[200px]">Orders you place will appear here.</p>
          </div>
        )}
      </div>

      {activeOrder && (
        <div className="absolute bottom-24 left-4 right-4 bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-10 transition-colors duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-black text-lg flex items-center gap-2 text-gray-900 dark:text-white">{activeOrder.status === 'Out for Delivery' ? "Arriving Soon" : "Order Placed"}</h3>
              <p className="text-xs text-gray-500">{activeOrder.items.length} Items • Order #{activeOrder.id.split('-')[1]}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600">{activeOrder.status === 'Out for Delivery' ? <Truck size={20} /> : <Package size={20} />}</div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 relative"><div className="flex flex-col items-center"><div className="w-3 h-3 bg-green-500 rounded-full z-10" /><div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 absolute top-3 left-1.5" /></div><div><p className="text-sm font-bold text-gray-800 dark:text-gray-200">Order Confirmed</p></div></div>
            <div className="flex gap-3 relative"><div className="flex flex-col items-center"><div className={`w-3 h-3 rounded-full z-10 ${activeOrder.status === 'Out for Delivery' ? 'bg-orange-500' : 'bg-gray-300'}`} /><div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 absolute top-3 left-1.5" /></div><div className={activeOrder.status === 'Out for Delivery' ? 'opacity-100' : 'opacity-50'}><p className="text-sm font-bold text-gray-800 dark:text-gray-200">Out for Delivery</p></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutFlow = ({ cart, user, onClose, onComplete }) => {
  const handleWhatsAppOrder = async () => {
    const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_phone', user.phone);
    const nextOrderNum = (count || 0) + 1;
    const orderId = `${user.phone}-${nextOrderNum}`;
    const newOrder = { id: orderId, user_phone: user.phone, customer_name: user.name, address: user.address, items: cart, status: 'Pending' };
    await supabase.from('orders').insert([newOrder]);
    let message = `*New Order - #${nextOrderNum}*\n👤 ${user.name}\n📍 ${user.address}\n\n*Items:*\n`;
    cart.forEach(item => message += `• ${item.name}: ${item.qty}\n`);
    window.open(`https://wa.me/${OWNER_PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    onComplete(); onClose();
  };
  return (
    <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col h-full">
      <div className="px-6 pb-3 flex items-center gap-4 border-b border-slate-800 bg-slate-900 text-white transition-colors duration-300"
           style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 border border-slate-700"><ArrowLeft size={20} /></button><h2 className="text-xl font-black">Checkout</h2>
      </div>
      <div className="p-6 space-y-4 overflow-y-auto h-full pb-24">
        <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <p className="font-bold text-gray-800 dark:text-gray-100">Deliver to:</p><p className="text-gray-700 dark:text-gray-300">{user.name}</p><p className="text-sm text-gray-500 dark:text-gray-400">{user.address}</p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <p className="font-bold mb-2 text-gray-800 dark:text-gray-100">Items:</p>
          {cart.map(i => (<div key={i.id} className="flex justify-between text-sm text-gray-700 dark:text-gray-300"><span>{i.name}</span><span>x{i.qty}</span></div>))}
        </div>
        <button onClick={handleWhatsAppOrder} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">Confirm Order <Send size={20} /></button>
      </div>
    </motion.div>
  );
};

const UserApp = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => { if (localStorage.getItem('theme')) { return localStorage.getItem('theme') === 'dark'; } return window.matchMedia('(prefers-color-scheme: dark)').matches; });
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('home');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const sessionPhone = localStorage.getItem('bricxo_session_phone');
    if(sessionPhone) { supabase.from('users').select('*').eq('phone', sessionPhone).single().then(({data}) => { if(data) setUser(data); }); }
    const fetchData = async () => { const { data: prodData } = await supabase.from('products').select('*'); const { data: catData } = await supabase.from('categories').select('*'); if(prodData) setProducts(prodData); if(catData) setCategories(catData); };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); } else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); } }, [darkMode]);

  const handleLogin = (userData) => { setUser(userData); localStorage.setItem('bricxo_session_phone', userData.phone); };
  const handleLogout = () => { setUser(null); localStorage.removeItem('bricxo_session_phone'); setCart([]); setView('home'); };

  const handleUpdateQty = (product, delta) => {
    setCart(prev => { const existing = prev.find(item => item.id === product.id); if (existing) { const newQty = existing.qty + delta; if (newQty <= 0) return prev.filter(item => item.id !== product.id); return prev.map(item => item.id === product.id ? { ...item, qty: newQty } : item); } else if (delta > 0) return [...prev, { ...product, qty: 1 }]; return prev; });
  };

  const getItemQty = (id) => cart.find(i => i.id === id)?.qty || 0;
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="fixed inset-0 w-full h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans overflow-hidden flex flex-col transition-colors duration-300">
      {view !== 'tracking' && view !== 'catalog' && view !== 'account' && (<Navbar darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} onOpenCalc={() => setIsCalcOpen(true)} />)}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar w-full h-full relative" style={{ WebkitOverflowScrolling: 'touch' }}>
        <AnimatePresence mode="wait">
           {view === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-full"><HomePage products={products} qtyHelper={getItemQty} updateQty={handleUpdateQty} /></motion.div>}
           {view === 'catalog' && <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-full"><CatalogPage products={products} categories={categories} qtyHelper={getItemQty} updateQty={handleUpdateQty} /></motion.div>}
           {view === 'tracking' && <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><TrackingPage user={user} /></motion.div>}
           {view === 'account' && <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><AccountPage user={user} onLogout={handleLogout} /></motion.div>}
        </AnimatePresence>
      </div>
      <AnimatePresence>{totalItems > 0 && view !== 'checkout' && <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setView('checkout')} className="fixed bottom-24 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl z-40 flex items-center justify-center hover:scale-105 transition-transform"><Send size={24} /><span className="absolute -top-1 -right-1 bg-white text-green-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-green-600">{totalItems}</span></motion.button>}</AnimatePresence>
      <AnimatePresence>{view === 'checkout' && <CheckoutFlow cart={cart} user={user} onClose={() => setView('home')} onComplete={() => { setCart([]); setView('tracking'); }} />}</AnimatePresence>
      <Calculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
      <div className="bg-slate-900 border-t border-slate-800 flex justify-around py-4 pb-safe-bottom z-50 shadow-2xl h-[80px] shrink-0 transition-colors duration-300">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'}`}><Home size={24} strokeWidth={view === 'home' ? 2.5 : 2} /></button>
        <button onClick={() => setView('catalog')} className={`flex flex-col items-center gap-1 ${view === 'catalog' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'}`}><Package size={24} strokeWidth={view === 'catalog' ? 2.5 : 2} /></button>
        <button onClick={() => setView('tracking')} className={`flex flex-col items-center gap-1 ${view === 'tracking' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'}`}><Truck size={24} strokeWidth={view === 'tracking' ? 2.5 : 2} /></button>
        <button onClick={() => setView('account')} className={`flex flex-col items-center gap-1 ${view === 'account' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'}`}><UserCircle size={24} strokeWidth={view === 'account' ? 2.5 : 2} /></button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserApp />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}