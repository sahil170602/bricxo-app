import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Package, Search, Truck, Calculator as CalculatorIcon,
  X, ArrowLeft, ShoppingCart, Plus, Minus, MapPin, UserCircle, LogOut, 
  Phone, MessageCircle, ChevronRight, Play, LifeBuoy,
  Construction, Moon, Sun, CheckCircle, CreditCard, Settings
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

const OWNER_PHONE_NUMBER = "917972506748"; 

// --- MAIN DATA ---
const MAIN_MATERIALS = [
  { id: 'sand', name: 'Sand', image: sandImg },
  { id: 'bricks', name: 'Bricks', image: bricksImg },
  { id: 'aggregates', name: 'Aggregates', image: aggregatesImg },
  { id: 'cement', name: 'Cement', image: cementImg },
];

const TMT_BAR_IMG = tmtImg;
const INVESTOR_IMG = investorImg;

// --- COMPONENTS ---

const Navbar = ({ location = "Nagpur", onCall }) => (
  <div 
    className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 pb-3 bg-slate-900 z-50 border-b border-slate-800 shadow-lg transition-colors duration-300"
    style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', height: 'auto', minHeight: 'calc(60px + env(safe-area-inset-top))' }}
  >
    <div className="flex items-center gap-1 mt-1">
      <h1 className="text-xl font-black tracking-tighter text-orange-500">BRICXO</h1>
    </div>
    <div className="flex items-center gap-3 mt-1">
      <div className="flex items-center gap-1 text-slate-300 text-sm font-bold">
        <span>{location}</span>
        <MapPin size={16} className="text-orange-500" fill="currentColor" />
      </div>
      <button onClick={onCall} className="text-orange-500 font-bold text-sm bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">Call Now</button>
    </div>
  </div>
);

const SubHeader = ({ title, onBack }) => (
  <div 
    className="absolute top-0 left-0 right-0 flex items-center gap-4 px-4 pb-3 bg-slate-900 z-50 border-b border-slate-800 shadow-lg"
    style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', height: 'auto', minHeight: 'calc(60px + env(safe-area-inset-top))' }}
  >
    <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"><ArrowLeft size={20} className="text-orange-500"/></button>
    <h2 className="text-lg font-black text-orange-500">{title}</h2>
  </div>
);

const MainMaterialCard = ({ item, onQuote }) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    onClick={() => onQuote(item.name)}
    className="relative rounded-xl overflow-hidden shadow-sm h-32 cursor-pointer group bg-gray-900"
  >
    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
    <div className="absolute bottom-0 w-full bg-black/90 py-2 px-3 flex justify-between items-center backdrop-blur-sm">
      <span className="text-orange-500 font-bold text-sm">{item.name}</span>
      <div className="flex items-center gap-1 text-gray-400 text-[10px] uppercase font-bold tracking-wide">
        <MessageCircle size={12} />
        <span>Get Quote</span>
      </div>
    </div>
  </motion.div>
);

const TmtCard = ({ onQuote }) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    onClick={() => onQuote('TMT Bars')}
    className="bg-blue-900 rounded-xl overflow-hidden shadow-md relative mt-3 h-28 flex items-center cursor-pointer"
  >
    <div className="w-1/2 p-4 z-10">
      <h3 className="text-orange-500 font-black text-xl italic">TMT Bars</h3>
      <p className="text-blue-200 text-xs">Steel Reinforcement</p>
      <span className="inline-block mt-2 bg-white/20 text-white text-[10px] px-2 py-1 rounded font-bold">Get Quote</span>
    </div>
    <div className="absolute right-0 top-0 h-full w-2/3">
      <img src={TMT_BAR_IMG} className="w-full h-full object-cover opacity-80" style={{clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)'}} />
    </div>
  </motion.div>
);

const CalculatorBanner = ({ onClick }) => (
  <motion.div whileTap={{ scale: 0.98 }} onClick={onClick} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm mt-6 cursor-pointer">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm font-bold text-orange-500">Material Calculator</h3>
        <p className="text-xs text-slate-500">Estimate materials in 30 seconds</p>
      </div>
      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600"><CalculatorIcon size={18} /></div>
    </div>
  </motion.div>
);

const InvestorCard = ({ onOpen }) => (
  <motion.div whileTap={{ scale: 0.98 }} onClick={onOpen} className="bg-gradient-to-r from-orange-500 to-red-500 p-1 rounded-2xl mt-6 shadow-lg shadow-orange-500/20 cursor-pointer">
    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
            <img src={INVESTOR_IMG} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-800" />
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-[8px] px-1 rounded-full border border-white">PRO</div>
        </div>
        <div><h3 className="font-bold text-orange-500 text-sm">Our Investor</h3><p className="text-xs text-gray-500">View Properties</p></div>
      </div>
      <div className="flex items-center gap-1 text-orange-600 text-xs font-bold animate-pulse"><span>Swipe Left</span><ChevronRight size={16} /></div>
    </div>
  </motion.div>
);

const ProductGrid = ({ products, qtyHelper, updateQty }) => {
  return (
    <div className="grid grid-cols-2 gap-4 pb-32 p-4">
      {products.map(p => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between">
          <div className="aspect-square mb-2 bg-gray-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center p-2 overflow-hidden">
            {p.image ? <img src={p.image} className="w-full h-full object-contain" /> : <Package className="text-gray-300" />}
          </div>
          <div>
            <h3 className="font-bold text-sm text-orange-500 line-clamp-2 leading-tight mb-2">{p.name}</h3>
            <div className="flex justify-between items-end">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">ADD</span>
              {qtyHelper(p.id) === 0 ? (
                <button onClick={() => updateQty(p, 1)} className="w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Plus size={16} /></button>
              ) : (
                <div className="flex items-center bg-slate-900 dark:bg-white rounded-full p-1 h-8 shadow-lg">
                  <button onClick={() => updateQty(p, -1)} className="w-6 h-full flex items-center justify-center text-white dark:text-slate-900"><Minus size={12} /></button>
                  <span className="text-xs font-bold text-white dark:text-slate-900 w-4 text-center">{qtyHelper(p.id)}</span>
                  <button onClick={() => updateQty(p, 1)} className="w-6 h-full flex items-center justify-center text-white dark:text-slate-900"><Plus size={12} /></button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- NEW ACCOUNT PAGE ---
const AccountView = ({ user, onLogout, darkMode, toggleTheme }) => (
  <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-950">
    <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
       <h2 className="text-xl font-black text-orange-500">My Account</h2>
    </div>
    
    <div className="p-4 space-y-6 overflow-y-auto flex-1 pb-32">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
        <div className="w-16 h-16 bg-orange-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-orange-600 font-bold text-2xl">
          {user.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <div>
          <h3 className="font-bold text-lg text-orange-500">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.phone}</p>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-orange-500 uppercase mb-3 ml-1">App Settings</h4>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden divide-y divide-gray-100 dark:divide-slate-700">
          
          <div className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50 dark:active:bg-slate-700/50 transition-colors" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">Dark Mode</span>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-orange-500' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>

        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-orange-500 uppercase mb-3 ml-1">Support</h4>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <button onClick={() => window.open(`https://wa.me/${OWNER_PHONE_NUMBER}`)} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left">
            <div className="p-2 bg-green-50 dark:bg-slate-700 rounded-lg text-green-600">
              <MessageCircle size={20} />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">Chat on WhatsApp</span>
          </button>
        </div>
      </div>

      <button onClick={onLogout} className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
        <LogOut size={20} /> Sign Out
      </button>
    </div>
  </div>
);

const CartView = ({ cart, updateQty, onBack, onCheckout }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-950">
      <SubHeader title="My Cart" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 pb-32" style={{ paddingTop: 'calc(65px + env(safe-area-inset-top))' }}>
        {cart.length === 0 ? (
          <div className="text-center py-20 opacity-50"><ShoppingCart size={48} className="mx-auto mb-4" /><p>Your cart is empty.</p></div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow-sm border border-gray-100 dark:border-slate-700">
                <div><h4 className="font-bold text-orange-500 text-sm">{item.name}</h4><p className="text-xs text-gray-500">Unit Price: ₹{item.price || 'N/A'}</p></div>
                <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button onClick={() => updateQty(item, -1)} className="p-2"><Minus size={14} /></button><span className="w-8 text-center font-bold text-sm">{item.qty}</span><button onClick={() => updateQty(item, 1)} className="p-2"><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pb-safe-bottom fixed bottom-0 w-full z-50">
          <div className="flex justify-between mb-4 text-sm font-bold text-slate-700 dark:text-white"><span>Total Items</span><span>{cart.length}</span></div>
          <button onClick={onCheckout} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 transition-colors">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

const CheckoutFlow = ({ cart, user, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_phone', user.phone);
      const nextOrderNum = (count || 0) + 1;
      const orderId = `${user.phone}-${nextOrderNum}`;
      
      const newOrder = { 
        id: orderId, 
        user_phone: user.phone, 
        customer_name: user.name, 
        address: user.address, 
        items: cart, 
        status: 'Pending', 
        payment_mode: 'Cash on Delivery',
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase.from('orders').insert([newOrder]);

      setLoading(false);
      
      if (error) {
        console.error("Supabase Order Error:", error);
        alert(`Order Failed: ${error.message}. Please check if 'payment_mode' column exists in Supabase.`);
      } else {
        setStep(3); 
        setTimeout(() => onComplete(), 3000); 
      }
    } catch (err) {
      setLoading(false);
      console.error("Unexpected Error:", err);
      alert("An unexpected error occurred. Please check console.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 flex flex-col h-full">
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center gap-4 sticky top-0" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        {step < 3 && <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft size={20} className="text-orange-500"/></button>}
        <h2 className="text-lg font-black text-orange-500">Checkout</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800">
              <h3 className="font-bold text-orange-500 text-xs uppercase mb-2">Deliver To</h3>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{user.address}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{user.phone}</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800">
              <h3 className="font-bold text-orange-500 text-xs uppercase mb-4">Order Summary</h3>
              {cart.map(item => (<div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-200 dark:border-slate-800 last:border-0"><span className="text-slate-700 dark:text-slate-300">{item.name} (x{item.qty})</span></div>))}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-4 shadow-lg">Confirm Details</button>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 mb-4"><CreditCard size={40} /></div>
            <h2 className="text-2xl font-black text-orange-500">Payment Method</h2>
            <div className="w-full bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-200 dark:border-orange-800/50 flex items-center gap-3">
              <CheckCircle className="text-orange-600 fill-orange-100" size={24} />
              <div className="text-left"><p className="font-bold text-slate-900 dark:text-white">Cash / Pay on Delivery</p><p className="text-xs text-slate-500">Pay via Cash or UPI upon delivery</p></div>
            </div>
            <button onClick={placeOrder} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold mt-8 shadow-lg">{loading ? "Placing Order..." : "Place Order"}</button>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"><CheckCircle size={48} /></motion.div>
            <h2 className="text-3xl font-black text-orange-500 mb-2">Order Placed!</h2>
            <p className="text-slate-500 mb-8">Your order has been sent to the admin. You can track it in Orders tab.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const OrdersPage = ({ user, onTrack }) => {
  const [activeTab, setActiveTab] = useState('live');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').eq('user_phone', user.phone).order('timestamp', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, [user]);

  const liveOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const historyOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-950">
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <h2 className="text-xl font-black text-orange-500 mb-4">My Orders</h2>
        <div className="flex bg-slate-800 p-1 rounded-xl">
          <button onClick={() => setActiveTab('live')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'live' ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}>Live Orders ({liveOrders.length})</button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}>History</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {loading ? <p className="text-center text-gray-400 mt-10">Loading orders...</p> : (
          <div className="space-y-4">
            {(activeTab === 'live' ? liveOrders : historyOrders).map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Order #{order.id.split('-')[1]}</span>
                    <h4 className="font-bold text-orange-500 text-sm">{new Date(order.timestamp).toLocaleDateString()}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{order.status}</span>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-gray-500 line-clamp-2">{order.items.map(i => `${i.name} x${i.qty}`).join(', ')}</p>
                </div>
                {activeTab === 'live' && (
                  <button onClick={() => onTrack(order)} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90">
                    <Truck size={16} /> Track Order
                  </button>
                )}
              </div>
            ))}
            {(activeTab === 'live' ? liveOrders : historyOrders).length === 0 && (
              <div className="text-center py-10 opacity-50">
                <p>No orders found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TrackingView = ({ order, onBack }) => {
  const steps = ['Pending', 'Accepted', 'Out for Delivery', 'Delivered'];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-950">
      <SubHeader title={`Track Order #${order.id.split('-')[1]}`} onBack={onBack} />
      
      {/* Map Animation */}
      <div className="relative h-64 bg-slate-200 dark:bg-slate-900 overflow-hidden w-full" style={{ paddingTop: 'calc(65px + env(safe-area-inset-top))' }}>
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path id="road" d="M -50 150 C 100 150, 150 50, 450 50" stroke="none" fill="none"/>
            <path d="M -50 150 C 100 150, 150 50, 450 50" stroke="#94a3b8" strokeWidth="40" strokeLinecap="round" className="dark:stroke-slate-700" />
            <path d="M -50 150 C 100 150, 150 50, 450 50" stroke="white" strokeWidth="2" strokeDasharray="15 15" fill="none" className="dark:stroke-slate-600"/>
            <circle cx="50" cy="150" r="8" fill="#10b981" /> 
            <circle cx="350" cy="50" r="8" fill="#ef4444" />
            {order.status === 'Out for Delivery' && (
              <circle r="10" fill="#f97316">
                <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#road" />
                </animateMotion>
              </circle>
            )}
         </svg>
         <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-white">
            {order.status === 'Out for Delivery' ? 'Driver is on the way...' : 'Order Status: ' + order.status}
         </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-3xl -mt-6 relative z-10 p-6 shadow-xl">
        <h3 className="font-bold text-lg mb-6 text-orange-500">Order Timeline</h3>
        <div className="space-y-8 pl-2">
          {steps.map((step, idx) => (
            <div key={step} className="flex gap-4 relative">
              {idx !== steps.length - 1 && (
                <div className={`absolute left-[11px] top-6 w-0.5 h-10 ${idx < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-700'}`} />
              )}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${idx <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'}`}>
                {idx <= currentStep ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
              </div>
              <div>
                <p className={`text-sm font-bold ${idx <= currentStep ? 'text-slate-900 dark:text-white' : 'text-gray-400'}`}>{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InvestorModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-[60] bg-black text-white flex flex-col h-full">
        <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10" style={{ paddingTop: 'max(20px, env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-3"><img src={INVESTOR_IMG} className="w-10 h-10 rounded-full border-2 border-orange-500" /><div><h3 className="font-bold text-sm">Investor Properties</h3><p className="text-[10px] text-gray-300">Latest Reels & Updates</p></div></div><button onClick={onClose}><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-scroll snap-y snap-mandatory">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-full w-full bg-slate-900 snap-center relative flex items-center justify-center border-b border-gray-800">
              <div className="text-center"><Play size={48} className="mx-auto text-white/50 mb-2" /><p className="text-gray-400 font-bold">Property Reel #{i}</p><p className="text-xs text-gray-600">Coming Soon</p></div><img src={`https://source.unsplash.com/random/400x800?building,interior&sig=${i}`} className="absolute inset-0 w-full h-full object-cover opacity-30 -z-10" />
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const UserApp = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [view, setView] = useState('home'); 
  const [subView, setSubView] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null); 

  useEffect(() => {
    const sessionPhone = localStorage.getItem('bricxo_session_phone');
    if(sessionPhone) { supabase.from('users').select('*').eq('phone', sessionPhone).single().then(({data}) => { if(data) setUser(data); }); }
    const fetchData = async () => { const { data: prodData } = await supabase.from('products').select('*'); const { data: catData } = await supabase.from('categories').select('*'); if(prodData) setProducts(prodData); if(catData) setCategories(catData); };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); } else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); } }, [darkMode]);

  const handleLogin = (userData) => { setUser(userData); localStorage.setItem('bricxo_session_phone', userData.phone); };
  
  const handleLogout = () => { setUser(null); localStorage.removeItem('bricxo_session_phone'); setCart([]); setView('home'); };

  const handleUpdateQty = (product, delta) => {
    setCart(prev => { 
      const existing = prev.find(item => item.id === product.id); 
      if (existing) { 
        const newQty = existing.qty + delta; 
        if (newQty <= 0) return prev.filter(item => item.id !== product.id); 
        return prev.map(item => item.id === product.id ? { ...item, qty: newQty } : item); 
      } else if (delta > 0) return [...prev, { ...product, qty: 1 }]; 
      return prev; 
    });
  };

  const getItemQty = (id) => cart.find(i => i.id === id)?.qty || 0;
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const mainMaterialNames = ['Sand', 'Bricks', 'Aggregates', 'Cement', 'TMT Bars', 'Steel'];
  const shopCategories = categories.filter(c => !mainMaterialNames.some(m => c.name.toLowerCase().includes(m.toLowerCase())));

  const handleQuote = (item) => { const text = `Hi Bricxo, I need a quote for *${item}*.`; window.open(`https://wa.me/${OWNER_PHONE_NUMBER}?text=${encodeURIComponent(text)}`, '_blank'); };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  // --- ROUTING LOGIC ---
  if (view === 'cart') return <CartView cart={cart} updateQty={handleUpdateQty} onBack={() => setView('home')} onCheckout={() => setView('checkout')} />;
  if (view === 'checkout') return <CheckoutFlow cart={cart} user={user} onClose={() => setView('cart')} onComplete={() => { setCart([]); setView('orders'); }} />;
  if (view === 'tracking' && trackedOrder) return <TrackingView order={trackedOrder} onBack={() => setView('orders')} />;

  return (
    <div className="fixed inset-0 w-full h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-hidden flex flex-col transition-colors duration-300">
      
      {/* Dynamic Header */}
      {subView === 'product-list' ? (
        <SubHeader title={selectedCategory} onBack={() => setSubView(null)} />
      ) : (
        view !== 'orders' && view !== 'account' && view !== 'calculator' && <Navbar location={user.address ? user.address.split(',')[0] : "Nagpur"} onCall={() => window.open(`tel:${OWNER_PHONE_NUMBER}`)} />
      )}
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar w-full h-full relative" style={{ paddingTop: (view === 'home' && !subView) ? 'calc(65px + env(safe-area-inset-top))' : '0', WebkitOverflowScrolling: 'touch' }}>
        
        {/* Product List Sub-View */}
        {subView === 'product-list' ? (
          <ProductGrid products={products.filter(p => p.category === selectedCategory || selectedCategory === 'All')} qtyHelper={getItemQty} updateQty={handleUpdateQty} />
        ) : (
          /* Main Views */
          <>
            {view === 'home' && (
              <div className="px-4 pb-32">
                <div className="mb-6">
                  {/* HEADER TEXT -> ORANGE */}
                  <h2 className="text-sm font-black text-orange-500 uppercase tracking-wider mb-3 mt-4">Main Materials</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {MAIN_MATERIALS.map(m => (<MainMaterialCard key={m.id} item={m} onQuote={handleQuote} />))}
                  </div>
                  <TmtCard onQuote={handleQuote} />
                </div>
                
                {/* Banner Removed per request */}

                <div className="mt-8">
                  {/* HEADER TEXT -> ORANGE */}
                  <h2 className="text-sm font-black text-orange-500 uppercase tracking-wider mb-3">Shop Products</h2>
                  
                  {/* UPDATED SHOP PRODUCTS GRID: Square Cards, 2-Columns */}
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    {shopCategories.length > 0 ? shopCategories.map(cat => (
                      <div 
                        key={cat.id} 
                        onClick={() => { setSelectedCategory(cat.name); setSubView('product-list'); }} 
                        className="relative aspect-square bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 cursor-pointer overflow-hidden group"
                      >
                        {/* Image / Icon Area */}
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-slate-700/30 text-4xl pb-6">
                           {/* FIXED: Check if cat.icon is actually an image URL or Base64 string */}
                           {cat.icon && (cat.icon.startsWith('data:image') || cat.icon.startsWith('http')) ? (
                             <img src={cat.icon} className="w-full h-full object-cover" alt={cat.name} />
                           ) : (
                             <span>{cat.icon || '📦'}</span>
                           )}
                        </div>
                        
                        {/* Bottom Name Label */}
                        <div className="absolute bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 border-t border-gray-100 dark:border-slate-700">
                          <span className="block text-center text-xs font-bold text-slate-800 dark:text-white truncate">
                            {cat.name}
                          </span>
                        </div>
                      </div>
                    )) : <div className="col-span-2 text-xs text-gray-400 italic text-center">No categories yet.</div>}
                  </div>
                </div>
                <InvestorCard onOpen={() => setSubView('investor')} />
              </div>
            )}
            
            {view === 'calculator' && <Calculator />}
            
            {/* UPDATED ORDERS PAGE */}
            {view === 'orders' && (
              <OrdersPage 
                user={user} 
                onTrack={(order) => { setTrackedOrder(order); setView('tracking'); }} 
              />
            )}

            {/* NEW ACCOUNT VIEW */}
            {view === 'account' && (
              <AccountView 
                user={user} 
                onLogout={handleLogout} 
                darkMode={darkMode} 
                toggleTheme={() => setDarkMode(!darkMode)} 
              />
            )}
          </>
        )}
      </div>

      {/* Floating Cart */}
      <AnimatePresence>
        {totalItems > 0 && view !== 'cart' && view !== 'checkout' && view !== 'calculator' && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setView('cart')} className="fixed bottom-24 right-6 bg-orange-600 text-white p-4 rounded-full shadow-2xl z-40 flex items-center justify-center hover:scale-105 transition-transform">
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-600">{totalItems}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <InvestorModal isOpen={subView === 'investor'} onClose={() => setSubView(null)} />
      
      {/* Bottom Nav */}
      <div className="bg-slate-900 border-t border-slate-800 flex justify-around py-2 pb-safe-bottom z-50 shadow-2xl h-[70px] shrink-0 transition-colors duration-300 fixed bottom-0 w-full">
        <NavButton icon={<Home size={22} />} label="Home" active={view === 'home'} onClick={() => { setView('home'); setSubView(null); }} />
        <NavButton icon={<CalculatorIcon size={22} />} label="Calculator" active={view === 'calculator'} onClick={() => { setView('calculator'); setSubView(null); }} />
        <NavButton icon={<Package size={22} />} label="Orders" active={view === 'orders'} onClick={() => { setView('orders'); setSubView(null); }} />
        <NavButton icon={<UserCircle size={22} />} label="Account" active={view === 'account'} onClick={() => { setView('account'); setSubView(null); }} />
      </div>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-full ${active ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'}`}>
    <div className={`p-1 rounded-xl transition-all`}>{icon}</div>
    <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
  </button>
);

const LoginScreen = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const checkUser = async () => { if(!phone || phone.length < 10) return alert("Enter valid phone"); setLoading(true); const { data } = await supabase.from('users').select('*').eq('phone', phone).single(); if(data) onLogin(data); else setStep(2); setLoading(false); };
  const registerUser = async () => { if(!name || !address) return alert("Fill details"); setLoading(true); const newUser = { phone, name, address }; const { error } = await supabase.from('users').insert([newUser]); if(!error) onLogin(newUser); setLoading(false); };
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center z-[60]">
      <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-slate-700 shadow-orange-500/10"><Construction size={48} className="text-orange-500" /></div>
      {/* HEADER TEXT -> ORANGE */}
      <h1 className="text-3xl font-black text-orange-500 mb-2 tracking-tight">Welcome to BRICXO</h1>
      <p className="text-slate-400 mb-10 text-sm font-medium">Your construction materials partner.</p>
      <div className="w-full max-w-sm space-y-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-sm">
        {step === 1 ? (<motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}}><label className="text-xs font-bold text-slate-400 uppercase mb-2 block text-left ml-1">Mobile Number</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none focus:border-orange-500 text-lg font-bold text-center placeholder-slate-600 transition-colors" /><button onClick={checkUser} disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold mt-4 shadow-lg hover:bg-orange-500 active:scale-95 transition-all">{loading ? "Checking..." : "Continue"}</button></motion.div>) : (<motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-4"><div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block text-left ml-1">Full Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none placeholder-slate-600 focus:border-orange-500" /></div><div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block text-left ml-1">Delivery Address</label><textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="House No, Street, City..." className="w-full p-4 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none placeholder-slate-600 focus:border-orange-500 resize-none" rows="3"></textarea></div><button onClick={registerUser} disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-500 active:scale-95 transition-all">{loading ? "Creating..." : "Start Ordering"}</button></motion.div>)}
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