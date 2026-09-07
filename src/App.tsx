import { useState, useEffect } from 'react';
import {
  RESTAURANT_INFO,
  CATEGORIES,
  MENU_ITEMS,
  TABLES,
} from './data/restaurantData';
import type { MenuItem } from './data/restaurantData';
import { DishDetailModal } from './components/Menu/DishDetailModal';
import { AIWaiterModal } from './components/AIWaiter/AIWaiterModal';
import { QRTableModal } from './components/QRCode/QRTableModal';
import { CartModal } from './components/Cart/CartModal';
import type { CartItem } from './components/Cart/CartModal';
import { Dish3DViewer } from './components/ARView/Dish3DViewer';
import {
  Crown,
  Flame,
  Salad,
  Utensils,
  Wheat,
  Sparkles,
  Coffee,
  Search,
  QrCode,
  ShoppingBag,
  MapPin,
  Eye,
  Globe,
  SlidersHorizontal,
  Plus,
  Clock,
  Check
} from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Table State & URL parameter binding
  const [currentTableId, setCurrentTableId] = useState<string>('VIP-1');

  // Modals state
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAIWaiterOpen, setIsAIWaiterOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dishFor3D, setDishFor3D] = useState<MenuItem | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Check URL query parameters for ?table=XYZ on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      const match = TABLES.find((t) => t.id.toLowerCase() === tableParam.toLowerCase());
      if (match) {
        setCurrentTableId(match.id);
      }
    }
  }, []);

  // Update HTML dir attribute for RTL
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const activeTableObj = TABLES.find((t) => t.id === currentTableId) || TABLES[0];

  // Cart operations
  const handleAddToCart = (dish: MenuItem, options?: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + (options?.quantity || 1) }
            : item
        );
      }
      return [...prev, { dish, quantity: options?.quantity || 1, notes: options?.notes }];
    });

    setAddedToast(lang === 'en' ? `Added ${dish.nameEn} to Table Order` : `تمت إضافة ${dish.nameAr} إلى الطلب`);
    setTimeout(() => setAddedToast(null), 2000);
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.dish.id === dishId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Filtering Menu Items
  const filteredItems = MENU_ITEMS.filter((dish) => {
    // Category match
    if (activeCategory !== 'all' && dish.category !== activeCategory) {
      return false;
    }

    // Dietary filter match
    if (activeFilter === 'chef_choice' && !dish.tags.includes('chef_choice')) return false;
    if (activeFilter === 'vegetarian' && !dish.tags.includes('vegetarian')) return false;
    if (activeFilter === 'gluten_free' && !dish.tags.includes('gluten_free')) return false;
    if (activeFilter === 'bestseller' && !dish.tags.includes('bestseller')) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEn = dish.nameEn.toLowerCase().includes(q) || dish.descriptionEn.toLowerCase().includes(q);
      const matchAr = dish.nameAr.includes(q) || dish.descriptionAr.includes(q);
      return matchEn || matchAr;
    }

    return true;
  });

  const categoryIcons: { [key: string]: any } = {
    heritage_signature: Crown,
    fukharat_hot: Flame,
    cold_mezze: Salad,
    grills_sajiyat: Utensils,
    fresh_bakery: Wheat,
    desserts: Sparkles,
    beverages: Coffee,
  };

  return (
    <div className="min-h-screen bg-[#090807] text-[#f7f2ea] font-sans pb-28 selection:bg-[#d4af37] selection:text-black">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89326] text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#17130f] via-[#261e14] to-[#17130f] border-b border-[#d4af37]/25 py-2 px-4 text-center text-xs text-[#f7ecd2] flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold">
          <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{lang === 'en' ? "MENA's 50 Best Restaurants Honoree" : 'ضمن قائمة أفضل ٥٠ مطعماً في الشرق الأوسط'}</span>
        </span>
        <span className="hidden sm:inline opacity-40">•</span>
        <span className="hidden sm:inline text-white/60">
          {lang === 'en' ? 'Authentic Jordanian Royal Cuisine' : 'المطبخ الأردني الملكي الأصيل'}
        </span>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-[#0e0c0a]/92 backdrop-blur-2xl border-b border-[#2d2417]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Restaurant Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f7ecd2] to-[#997d26] p-0.5 shadow-xl shadow-[#d4af37]/20">
              <div className="w-full h-full bg-[#14110e] rounded-[14px] flex items-center justify-center text-2xl font-serif-luxury font-bold text-[#d4af37]">
                س
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white m-0 font-serif-luxury">
                  {lang === 'en' ? RESTAURANT_INFO.nameEn : RESTAURANT_INFO.nameAr}
                </h1>
                <span className="text-[9px] bg-[#d4af37]/15 text-[#f7ecd2] px-2 py-0.5 rounded-full border border-[#d4af37]/35 font-bold uppercase tracking-wider hidden md:inline">
                  {lang === 'en' ? 'Amman' : 'عمّان'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/50">
                <MapPin className="w-3 h-3 text-[#d4af37]" />
                <span className="truncate max-w-[140px] sm:max-w-xs">
                  {lang === 'en' ? 'Rainbow St, Jabal Amman' : 'شارع الرينبو، جبل عمّان'}
                </span>
              </div>
            </div>
          </div>

          {/* Table Indicator & Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Table Badge */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex items-center gap-2 bg-[#181410] hover:bg-[#251e17] border border-[#d4af37]/40 rounded-2xl px-3 py-2 transition text-xs shadow-md"
              title="Table QR Stand & Selector"
            >
              <QrCode className="w-4 h-4 text-[#d4af37]" />
              <div className="text-left hidden sm:block">
                <div className="text-[9px] text-white/50 uppercase tracking-wider leading-none">
                  {lang === 'en' ? 'Table' : 'الطاولة'}
                </div>
                <div className="text-white font-bold leading-tight">
                  {activeTableObj.id}
                </div>
              </div>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 bg-[#181410] hover:bg-[#251e17] border border-white/10 hover:border-[#d4af37]/50 rounded-2xl px-3 py-2 transition text-xs font-bold text-white/80"
              title="Toggle Language"
            >
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Table Bill & Order Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 gold-gradient-btn text-black rounded-2xl px-4 py-2 font-bold text-xs shadow-xl transition hover:scale-102 active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">
                {lang === 'en' ? 'Table Order' : 'الطلب'}
              </span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-black text-[#d4af37] text-[11px] font-bold flex items-center justify-center shadow-inner">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden bg-radial from-[#1e1812] via-[#100d0a] to-[#090807] border-b border-[#2d2417] py-8 sm:py-14 px-4">
        {/* Subtle decorative gold glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-2xl text-center md:text-left rtl:md:text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#f7ecd2] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{lang === 'en' ? 'Heritage Gastronomy • 1920s Jabal Amman Villa' : 'تراث الضيافة الأردنية • فيلا جبل عمّان التاريخية'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif-luxury tracking-tight leading-tight m-0">
              {lang === 'en' ? (
                <>
                  Royal Jordanian Flavors <br />
                  <span className="gold-gradient-text">Crafted Over Open Coals</span>
                </>
              ) : (
                <>
                  أصالة المائدة الأردنية <br />
                  <span className="gold-gradient-text">على نار الحطب وفخار الحجر</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
              {lang === 'en' ? RESTAURANT_INFO.storyEn : RESTAURANT_INFO.storyAr}
            </p>

            {/* Quick Action Chips */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start rtl:md:justify-start gap-3">
              <button
                onClick={() => setIsAIWaiterOpen(true)}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl gold-gradient-btn text-black font-bold text-sm shadow-xl hover:scale-102 active:scale-98 transition"
              >
                <span className="text-lg">🤵</span>
                <span>{lang === 'en' ? 'Speak with AI Waiter (Karam)' : 'محادثة النادل الذكي (كرم)'}</span>
              </button>

              <button
                onClick={() => {
                  const mansaf = MENU_ITEMS.find((i) => i.id === 'mansaf-baladi');
                  if (mansaf) setDishFor3D(mansaf);
                }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#1a1510] hover:bg-[#272018] text-[#f7ecd2] border border-[#d4af37]/40 text-xs font-semibold transition"
              >
                <Eye className="w-4 h-4 text-[#d4af37]" />
                <span>{lang === 'en' ? 'Inspect Royal Mansaf in 3D' : 'معاينة المنسف الملكي ثلاثي الأبعاد'}</span>
              </button>
            </div>
          </div>

          {/* Signature Platter Spotlight Card */}
          <div className="w-full max-w-sm bg-[#14100c] border border-[#d4af37]/40 rounded-3xl p-4 shadow-2xl relative group hover:border-[#d4af37] transition duration-300">
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img
                src={MENU_ITEMS[0].image}
                alt="Royal Mansaf"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/40 flex items-center gap-1.5">
                <Crown className="w-3 h-3 text-[#d4af37]" />
                <span>{lang === 'en' ? 'UNESCO Heritage' : 'تراث عالمي'}</span>
              </div>
            </div>

            <div className="mt-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base font-serif-luxury">
                  {lang === 'en' ? MENU_ITEMS[0].nameEn : MENU_ITEMS[0].nameAr}
                </h3>
                <span className="font-serif-luxury font-bold text-[#d4af37] text-base">
                  {MENU_ITEMS[0].price.toFixed(2)} JOD
                </span>
              </div>
              <p className="text-xs text-white/60 line-clamp-2">
                {lang === 'en' ? MENU_ITEMS[0].descriptionEn : MENU_ITEMS[0].descriptionAr}
              </p>
            </div>

            <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center gap-2">
              <button
                onClick={() => handleAddToCart(MENU_ITEMS[0])}
                className="flex-1 py-2.5 gold-gradient-btn text-black font-bold text-xs rounded-xl transition text-center shadow-md flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{lang === 'en' ? 'Add to Table' : 'أضف للطلب'}</span>
              </button>
              <button
                onClick={() => setDishFor3D(MENU_ITEMS[0])}
                className="p-2.5 bg-white/10 hover:bg-[#d4af37] text-[#f7ecd2] hover:text-black rounded-xl transition border border-white/10"
                title="Inspect in 3D"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#d4af37] absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'en'
                ? 'Search dishes, ingredients (e.g. Mansaf, Tahini, Lamb, Halloumi)...'
                : 'ابحث عن أطباق، مكونات (منسف، طحينية، مشاوي، حلوم، جميد)...'
            }
            className="w-full bg-[#130f0c] border border-white/10 focus:border-[#d4af37] text-white text-sm rounded-2xl py-3.5 px-12 rtl:pr-12 rtl:pl-4 outline-none transition placeholder:text-white/30 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'gold-gradient-btn text-black border-[#d4af37] shadow-lg'
                : 'bg-[#15110d] text-white/70 border-white/10 hover:border-white/25'
            }`}
          >
            <span>✨</span>
            <span>{lang === 'en' ? 'Full Menu' : 'القائمة كاملة'}</span>
          </button>

          {CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id] || Crown;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition flex items-center gap-2 ${
                  isSelected
                    ? 'gold-gradient-btn text-black border-[#d4af37] shadow-lg'
                    : 'bg-[#15110d] text-white/70 border-white/10 hover:border-[#d4af37]/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#d4af37]'}`} />
                <span>{lang === 'en' ? cat.nameEn : cat.nameAr}</span>
              </button>
            );
          })}
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-[#d4af37]" />
            <span>{lang === 'en' ? 'Filter:' : 'تصفية:'}</span>
          </span>

          {[
            { id: 'all', labelEn: 'All', labelAr: 'الكل' },
            { id: 'chef_choice', labelEn: "👑 Chef's Signature", labelAr: '👑 توقيع الشيف' },
            { id: 'bestseller', labelEn: '🔥 Bestsellers', labelAr: '🔥 الأكثر طلباً' },
            { id: 'vegetarian', labelEn: '🌱 Vegetarian', labelAr: '🌱 نباتي' },
            { id: 'gluten_free', labelEn: '🌾 Gluten-Free', labelAr: '🌾 خالي من الجلوتين' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${
                activeFilter === filter.id
                  ? 'bg-[#272018] text-[#f7ecd2] border-[#d4af37]'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
              }`}
            >
              {lang === 'en' ? filter.labelEn : filter.labelAr}
            </button>
          ))}
        </div>
      </section>

      {/* Menu Dish Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white font-serif-luxury m-0">
            {activeCategory === 'all'
              ? (lang === 'en' ? 'Culinary Masterpieces' : 'أطباق السفرة الملكية')
              : (lang === 'en'
                  ? CATEGORIES.find((c) => c.id === activeCategory)?.nameEn
                  : CATEGORIES.find((c) => c.id === activeCategory)?.nameAr)}
          </h2>
          <span className="text-xs text-white/40 font-mono">
            {filteredItems.length} {lang === 'en' ? 'Dishes' : 'أطباق'}
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#130f0c] rounded-3xl border border-white/5">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-white">
              {lang === 'en' ? 'No dishes match your filter' : 'لم نجد أطباق مطابقة للبحث'}
            </h3>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 gold-gradient-btn text-black text-xs font-bold rounded-xl"
            >
              {lang === 'en' ? 'Reset Filters' : 'إعادة ضبط القائمة'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((dish) => (
              <div
                key={dish.id}
                className="bg-[#14100c] border border-[#272018] hover:border-[#d4af37]/60 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-[#d4af37]/10"
              >
                {/* Dish Image */}
                <div
                  onClick={() => {
                    setSelectedDish(dish);
                    setIsDetailOpen(true);
                  }}
                  className="relative h-48 sm:h-52 w-full overflow-hidden cursor-pointer"
                >
                  <img
                    src={dish.image}
                    alt={dish.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14100c] via-transparent to-transparent opacity-85" />

                  {/* 3D Badge */}
                  {dish.has3DPreview && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDishFor3D(dish);
                      }}
                      className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-3 py-1.5 rounded-full bg-black/80 hover:bg-[#d4af37] text-white hover:text-black text-[10px] font-bold backdrop-blur-md border border-white/20 transition flex items-center gap-1.5 shadow-lg"
                      title="Inspect dish in 3D"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d4af37] group-hover:text-black" />
                      <span>3D View</span>
                    </button>
                  )}

                  {/* Top Tag */}
                  {dish.tags.includes('chef_choice') && (
                    <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89326] text-black text-[10px] font-bold shadow-md">
                      {lang === 'en' ? "Chef's Signature" : 'توقيع الشيف'}
                    </span>
                  )}

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 bg-[#120f0d]/90 backdrop-blur-md px-3.5 py-1 rounded-xl border border-[#d4af37]/45 text-[#d4af37] font-serif-luxury font-bold text-sm">
                    {dish.price.toFixed(2)} JOD
                  </div>
                </div>

                {/* Dish Info */}
                <div
                  onClick={() => {
                    setSelectedDish(dish);
                    setIsDetailOpen(true);
                  }}
                  className="p-5 flex-1 flex flex-col justify-between cursor-pointer space-y-3"
                >
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-[#f7ecd2] transition font-serif-luxury">
                      {lang === 'en' ? dish.nameEn : dish.nameAr}
                    </h3>
                    <p className="text-xs text-white/60 line-clamp-2 mt-1.5 leading-relaxed font-light">
                      {lang === 'en' ? dish.descriptionEn : dish.descriptionAr}
                    </p>
                  </div>

                  {/* Dietary icons & preparation time */}
                  <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1 text-[#d4af37]">
                      <Clock className="w-3 h-3" />
                      {dish.preparationTime}
                    </span>
                    <span>{dish.calories} kcal</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(dish)}
                    className="w-full py-2.5 rounded-xl bg-[#201a14] hover:bg-[#d4af37] text-white hover:text-black font-bold text-xs border border-white/10 hover:border-[#d4af37] transition flex items-center justify-center gap-2 group/btn"
                  >
                    <Plus className="w-4 h-4 text-[#d4af37] group-hover/btn:text-black transition" />
                    <span>{lang === 'en' ? 'Add to Table Order' : 'إضافة للطلب'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Sticky AI Waiter Button */}
      <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40">
        <button
          onClick={() => setIsAIWaiterOpen(true)}
          className="relative flex items-center gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-full gold-gradient-btn text-black font-bold shadow-2xl hover:scale-105 active:scale-95 transition group"
        >
          {/* Subtle pulsing aura */}
          <span className="absolute -inset-1 rounded-full bg-[#d4af37]/35 animate-ping -z-10" />

          <div className="w-9 h-9 rounded-full bg-[#14100c] flex items-center justify-center text-xl shadow-inner">
            🤵
          </div>
          <div className="text-left rtl:text-right hidden sm:block">
            <div className="text-[9px] uppercase tracking-widest text-black/80 font-bold leading-tight">
              {lang === 'en' ? 'AI Gastronomy Concierge' : 'نادل سفرة الذكي'}
            </div>
            <div className="text-xs font-extrabold text-black leading-tight">
              {lang === 'en' ? 'Ask Karam' : 'تحدث مع كرم'}
            </div>
          </div>
        </button>
      </div>

      {/* Footer Heritage Note */}
      <footer className="mt-20 border-t border-[#272018] py-10 text-center text-xs text-white/50 space-y-2">
        <div className="font-serif-luxury font-bold text-[#d4af37] tracking-widest text-sm">
          SUFRA AMMAN • مطعم سفرة
        </div>
        <p className="max-w-md mx-auto text-white/40 px-4">
          {lang === 'en'
            ? 'Rainbow Street, Jabal Amman, Jordan • Part of Romero Group • Dedicated to preserving Jordanian culinary heritage.'
            : 'شارع الرينبو، جبل عمّان، الأردن • مجموعة روميرو • مكرسون للحفاظ على تراث الطهي الأردني الملكي.'}
        </p>
      </footer>

      {/* --- MODALS --- */}
      {/* 1. Dish Details Modal */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        lang={lang}
        onAddToCart={handleAddToCart}
        onOpen3D={(dish) => {
          setIsDetailOpen(false);
          setDishFor3D(dish);
        }}
      />

      {/* 2. AI Waiter Modal */}
      <AIWaiterModal
        isOpen={isAIWaiterOpen}
        onClose={() => setIsAIWaiterOpen(false)}
        lang={lang}
        currentTable={activeTableObj}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onOpen3D={(dish) => {
          setIsAIWaiterOpen(false);
          setDishFor3D(dish);
        }}
      />

      {/* 3. QR Table Stand & Scanner Modal */}
      <QRTableModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        lang={lang}
        currentTableId={currentTableId}
        onSelectTable={(tableId) => {
          setCurrentTableId(tableId);
          const newUrl = `${window.location.pathname}?table=${tableId}`;
          window.history.pushState({}, '', newUrl);
        }}
      />

      {/* 4. Cart & Table Bill Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lang={lang}
        currentTable={activeTableObj}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      {/* 5. 3D / AR Dish Viewer */}
      {dishFor3D && (
        <Dish3DViewer
          dish={dishFor3D}
          lang={lang}
          onClose={() => setDishFor3D(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

export default App;
