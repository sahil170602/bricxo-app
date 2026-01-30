import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ListOrdered, CheckCircle, 
  LogOut, Plus, Trash2, Edit2, X, Search, Package, 
  Truck, Clock, Bell, Menu, Upload, Image as ImageIcon,
  Layers, Star, CheckSquare, Lock, CreditCard
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- AUTH STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const ADMIN_PIN = "1234";

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      fetchData();
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to sign out?")) {
      sessionStorage.removeItem('admin_auth');
      setIsAuthenticated(false);
      setPin('');
      setError('');
    }
  };

  const fetchData = async () => {
    try {
      const { data: prodData } = await supabase.from('products').select('*').order('id');
      const { data: catData } = await supabase.from('categories').select('*').order('id');
      const { data: ordData } = await supabase.from('orders').select('*').order('timestamp', { ascending: false });

      if (prodData) setProducts(prodData);
      if (catData) setCategories(catData);
      if (ordData) setOrders(ordData);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!isAuthenticated) return;
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleUpdateStatus = async (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Delete this item?")) return;
    setProducts(products.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const handleSaveProduct = async (product) => {
    const { id, ...data } = product;
    if (id) {
      await supabase.from('products').update(data).eq('id', id);
    } else {
      await supabase.from('products').insert([data]);
    }
    fetchData();
  };

  const handleAddCategory = async (name, icon) => {
    const newCat = { name, icon, color: "bg-gray-100" };
    await supabase.from('categories').insert([newCat]);
    fetchData();
  };

  const handleDeleteCategory = async (id) => {
    if(!window.confirm("Delete this category?")) return;
    setCategories(categories.filter(c => c.id !== id));
    await supabase.from('categories').delete().eq('id', id);
  };

  const renderContent = () => {
    if (loading && isAuthenticated) return <div className="p-10 text-center text-gray-500">Connecting to Supabase...</div>;

    switch (activeTab) {
      case 'dashboard': return <DashboardHome orders={orders} products={products} />;
      case 'products': return <ProductManager products={products} categories={categories} onSave={handleSaveProduct} onDelete={handleDeleteProduct} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />;
      case 'orders': return <OrderManager orders={orders} onUpdateStatus={handleUpdateStatus} type="active" />;
      case 'history': return <OrderManager orders={orders} onUpdateStatus={handleUpdateStatus} type="history" />;
      default: return <DashboardHome />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">Admin Locked</h1>
          <p className="text-gray-500 mb-6 text-sm">Enter security PIN to access dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center text-2xl tracking-[0.5em] font-bold p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-orange-500 transition-colors"
              placeholder="••••"
              maxLength={4}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Unlock
            </button>
            <button type="button" onClick={() => window.location.href='/'} className="block w-full text-gray-400 text-xs font-bold hover:text-gray-600">
              Back to App
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex font-sans text-slate-800 relative overflow-hidden">
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white p-4 flex justify-between items-center z-40 shadow-md h-16">
        <h1 className="text-xl font-black text-orange-500 tracking-tighter">BRICXO</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}

      <aside className={`fixed inset-y-0 right-0 md:left-0 bg-slate-900 text-white w-64 transform transition-transform duration-300 z-50 shadow-2xl md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} flex flex-col h-full`}>
        <div className="p-6">
          <div className="hidden md:block">
            <h1 className="text-2xl font-black text-orange-500 tracking-tighter">BRICXO<span className="text-white">.</span></h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Admin Console</p>
          </div>
          <div className="md:hidden flex items-center justify-between">
             <span className="text-xl font-bold tracking-tight text-white">Menu</span>
             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
               <X size={20} />
             </button>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-3 overflow-y-auto mt-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<ShoppingBag size={20}/>} label="Products" active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<ListOrdered size={20}/>} label="Live Orders" active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }} />
          <NavItem icon={<CheckCircle size={20}/>} label="Completed" active={activeTab === 'history'} onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full p-3 hover:bg-slate-800 rounded-xl font-bold">
            <LogOut size={20} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="md:ml-64 flex-1 h-full overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-gray-50">
        <header className="flex justify-between items-center mb-6 md:mb-10">
          <div><h2 className="text-2xl md:text-3xl font-bold capitalize">{activeTab}</h2></div>
          <div className="flex gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30">A</div>
          </div>
        </header>
        <div className="pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const DashboardHome = ({ orders = [], products = [] }) => {
  const pending = orders.filter(o => o.status === 'Pending').length;
  const active = orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Accepted').length;
  const done = orders.filter(o => o.status === 'Delivered').length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Pending" value={pending} color="bg-blue-500" icon={<Clock size={20}/>} />
        <StatCard label="Active/Transit" value={active} color="bg-orange-500" icon={<Truck size={20}/>} />
        <StatCard label="Completed" value={done} color="bg-green-500" icon={<CheckCircle size={20}/>} />
        <StatCard label="Total Items" value={products.length} color="bg-slate-800" icon={<Package size={20}/>} />
      </div>
    </div>
  );
};

const ProductManager = ({ products, categories, onSave, onDelete, onAddCategory, onDeleteCategory }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (item = null) => {
    setEditingItem(item || { name: '', price: '', category: categories[0]?.name || '', image: '', featured: false });
    setModalOpen(true);
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditingItem({ ...editingItem, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleCatImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewCatIcon(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Layers size={20} className="text-orange-500"/> Manage Categories</h3>
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div className="flex-1 min-w-[150px]"><label className="text-xs font-bold uppercase text-gray-400">Name</label><input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="e.g. Electrical" className="w-full p-2 border rounded-lg text-sm" /></div>
          <div>
             <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Icon</label>
             <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 bg-white min-w-[100px] justify-center">
                {newCatIcon ? <img src={newCatIcon} className="w-5 h-5 object-cover rounded" alt="icon" /> : <Upload size={16} className="text-gray-400" />}
                <span className="text-xs font-bold text-gray-600">{newCatIcon ? "Change" : "Upload"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleCatImageUpload} />
             </label>
          </div>
          <button onClick={() => { if(newCatName) { onAddCategory(newCatName, newCatIcon); setNewCatName(''); setNewCatIcon(null); }}} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold h-[38px]">Add Category</button>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium">
              <div className="w-6 h-6 rounded overflow-hidden bg-white flex-shrink-0 border border-gray-100 flex items-center justify-center">
                 {cat.icon ? <img src={cat.icon} alt="icon" className="w-full h-full object-contain" /> : <span className="text-xs">IMG</span>}
              </div>
              <span>{cat.name}</span>
              <button onClick={() => onDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 ml-1"><X size={14}/></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h3 className="font-bold text-lg">Inventory</h3>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2.5 bg-white rounded-lg border border-gray-200 outline-none focus:border-orange-500" 
              />
            </div>
            <button onClick={() => openModal()} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-700 shadow-lg shadow-orange-600/20 whitespace-nowrap"><Plus size={18} /> Add Item</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr><th className="p-4">Item</th><th className="p-4">Category</th><th className="p-4">Featured</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">{p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Package size={16} />}</div>
                    <span className="font-bold text-gray-700">{p.name}</span>
                  </td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold uppercase">{p.category}</span></td>
                  <td className="p-4">{p.featured ? <Star size={16} className="text-orange-500 fill-orange-500"/> : <span className="text-gray-300">-</span>}</td>
                  <td className="p-4 font-mono text-gray-500">₹{p.price}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => openModal(p)} className="p-2 text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingItem.id ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                 <div className="relative w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group">
                    {editingItem.image ? <img src={editingItem.image} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-400" />}
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs"><Upload size={20} className="mb-1" /> Change<input type="file" className="hidden" accept="image/*" onChange={handleProductImageUpload} /></label>
                 </div>
              </div>
              <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Item Name</label><input value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:border-orange-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price</label><input value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:border-orange-500" type="number" /></div>
                 <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label><select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full p-3 border rounded-lg outline-none focus:border-orange-500 bg-white"><option value="" disabled>Select</option>{categories.map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}</select></div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer bg-gray-50" onClick={() => setEditingItem({...editingItem, featured: !editingItem.featured})}>
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${editingItem.featured ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'}`}>{editingItem.featured && <CheckCircle size={14} className="text-white" />}</div>
                <span className="text-sm font-bold text-gray-700">Show on Homepage</span>
              </div>
              <button onClick={() => { onSave(editingItem); setModalOpen(false); }} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold mt-2 hover:bg-orange-700">Save Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderManager = ({ orders, onUpdateStatus, type }) => {
  const filtered = orders.filter(o => type === 'active' ? o.status !== 'Delivered' : o.status === 'Delivered');
  if (filtered.length === 0) return <div className="text-center p-12 text-gray-400 bg-white rounded-xl border border-gray-100">No {type} orders found.</div>;
  return (
    <div className="grid grid-cols-1 gap-4">
      {filtered.slice().reverse().map(order => (
        <div key={order.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <div className="flex items-center justify-between md:justify-start gap-3 mb-1">
              <span className="font-mono font-bold text-orange-600">{order.id}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.status === 'Pending' ? 'bg-blue-100 text-blue-600' : order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{order.status}</span>
            </div>
            <h4 className="font-bold text-lg">{order.customer_name}</h4>
            <p className="text-sm text-gray-500 mb-2 truncate max-w-[250px]">{order.address}</p>
            <div className="text-sm text-gray-700 font-medium mb-2">{order.items.map(i => `${i.name} (${i.qty})`).join(', ')}</div>
            
            {/* Payment Mode Display */}
            {order.payment_mode && (
              <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">
                <CreditCard size={12} /> {order.payment_mode}
              </div>
            )}
          </div>
          <div className="flex w-full md:w-auto gap-2">
            {order.status === 'Pending' && <button onClick={() => onUpdateStatus(order.id, 'Accepted')} className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 shadow-lg">Accept</button>}
            {order.status === 'Accepted' && <button onClick={() => onUpdateStatus(order.id, 'Out for Delivery')} className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg">Dispatch</button>}
            {order.status === 'Out for Delivery' && <button onClick={() => onUpdateStatus(order.id, 'Delivered')} className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-green-500 shadow-lg">Complete</button>}
            {order.status === 'Delivered' && <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={16}/> Delivered</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (<div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all font-medium ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{icon}<span>{label}</span></div>);
const StatCard = ({ label, value, color, icon }) => (<div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4"><div className={`w-10 h-10 md:w-12 md:h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>{icon}</div><div><div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase">{label}</div><div className="text-xl md:text-2xl font-black text-slate-800">{value}</div></div></div>);