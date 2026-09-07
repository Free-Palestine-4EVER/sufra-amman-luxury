import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RESTAURANT_INFO } from '../../data/restaurantData';
import type { MenuItem } from '../../data/restaurantData';
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  ChefHat,
  Flame,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  selectedOption?: string;
  notes?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
  currentTable: { id: string; nameEn: string; nameAr: string };
  items: CartItem[];
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  currentTable,
  items,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [orderStage, setOrderStage] = useState<number>(0); // 0: Review, 1-4: Kitchen tracking
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const serviceCharge = subtotal * RESTAURANT_INFO.serviceRate; // 10%
  const salesTax = subtotal * RESTAURANT_INFO.taxRate; // 16%
  const tipAmount = (subtotal * tipPercentage) / 100;
  const grandTotal = subtotal + serviceCharge + salesTax + tipAmount;
  const grandTotalUSD = grandTotal * 1.41; // Pegged approx 1 JOD = 1.41 USD

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    // Fire celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f3e5ab', '#ffffff']
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderStage(1);

      // Simulate live kitchen progression
      setTimeout(() => setOrderStage(2), 3500);
      setTimeout(() => setOrderStage(3), 7500);
      setTimeout(() => setOrderStage(4), 12000);
    }, 1000);
  };

  const handleResetOrder = () => {
    onClearCart();
    setOrderStage(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[92vh] sm:h-[720px] bg-[#141210] border border-[#d4af37]/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2d251a] bg-[#1a1714]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase">
                {lang === 'en' ? 'Table Service & Bill' : 'طلب وفاتورة الطاولة'}
              </div>
              <h3 className="text-base font-bold text-white">
                {lang === 'en' ? currentTable.nameEn : currentTable.nameAr}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {orderStage > 0 ? (
          // --- LIVE KITCHEN ORDER TRACKER ---
          <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#d4af37]/15 border-2 border-[#d4af37] flex items-center justify-center text-3xl">
                {orderStage === 1 && '📝'}
                {orderStage === 2 && '🔥'}
                {orderStage === 3 && '👨‍🍳'}
                {orderStage === 4 && '✨'}
              </div>
              <h2 className="text-xl font-bold text-white">
                {orderStage === 1 && (lang === 'en' ? 'Order Received in Kitchen' : 'تم استلام الطلب في المطبخ')}
                {orderStage === 2 && (lang === 'en' ? 'Baking & Charcoal Grilling' : 'الطهي في فرن الحجر والشواية')}
                {orderStage === 3 && (lang === 'en' ? 'Plating & Garnish with Pine Nuts' : 'التزيين بالسمن البلدي والمكسرات')}
                {orderStage === 4 && (lang === 'en' ? 'Delivering to Your Table!' : 'الطلب في طريقه إلى طاولتكم الآن!')}
              </h2>
              <p className="text-xs text-white/60">
                {lang === 'en'
                  ? `Sufra kitchen is preparing your feast for ${currentTable.nameEn}.`
                  : `مطبخ سفرة يحضر مائدتكم الملكية لـ ${currentTable.nameAr}.`}
              </p>
            </div>

            {/* Stages Stepper */}
            <div className="space-y-4 max-w-md mx-auto w-full">
              {[
                { stage: 1, titleEn: "Order Sent to Head Chef", titleAr: "إرسال الطلب للشيف التنفيذي", icon: ChefHat },
                { stage: 2, titleEn: "Fired in Stone Oven & Charcoal", titleAr: "الطهي على الفحم والحجر البركاني", icon: Flame },
                { stage: 3, titleEn: "Artisanal Garnish & Jameed Pour", titleAr: "التزيين النهائي وصب الجميد الساخن", icon: Sparkles },
                { stage: 4, titleEn: "Served to Table with Warm Bread", titleAr: "تقديم المائدة مع الخبز الساخن", icon: UtensilsCrossed }
              ].map((step) => {
                const isDone = orderStage >= step.stage;
                const isCurrent = orderStage === step.stage;
                const Icon = step.icon;

                return (
                  <div
                    key={step.stage}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                        : isDone
                        ? 'bg-[#1a1714] border-emerald-500/40 text-emerald-400'
                        : 'bg-[#141210] border-white/5 opacity-40'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-black'
                          : isCurrent
                          ? 'bg-[#d4af37] text-black animate-pulse'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">
                        {lang === 'en' ? step.titleEn : step.titleAr}
                      </div>
                      <div className="text-[10px] text-white/50">
                        {isCurrent ? (lang === 'en' ? 'In Progress...' : 'قيد التنفيذ...') : isDone ? (lang === 'en' ? 'Completed' : 'مكتمل') : (lang === 'en' ? 'Pending' : 'قريباً')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                onClick={handleResetOrder}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89326] text-black font-bold text-sm shadow-lg hover:brightness-110 transition"
              >
                {lang === 'en' ? 'Done / Place Another Order' : 'تم / إضافة طلب جديد'}
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          // --- EMPTY CART ---
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
              🍽️
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {lang === 'en' ? 'Your Table Order is Empty' : 'قائمة طلب الطاولة فارغة'}
              </h3>
              <p className="text-xs text-white/60 max-w-xs">
                {lang === 'en'
                  ? 'Explore our heritage menu or ask AI Waiter Karam for royal recommendations!'
                  : 'تصفح قائمة الأطباق الملكية أو اطلب من نادلنا الذكي كرم ترشيح الأنسب لكم!'}
              </p>
            </div>
          </div>
        ) : (
          // --- CART ITEMS & BILL SUMMARY ---
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            {/* Items List */}
            <div className="p-4 space-y-3 divide-y divide-white/5 overflow-y-auto max-h-60 sm:max-h-72">
              {items.map((item) => (
                <div key={item.dish.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.dish.image}
                    alt={item.dish.nameEn}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {lang === 'en' ? item.dish.nameEn : item.dish.nameAr}
                    </h4>
                    <div className="text-xs font-serif-luxury font-bold text-[#d4af37] mt-0.5">
                      {(item.dish.price * item.quantity).toFixed(2)} JOD
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-[#1e1b17] border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.dish.id, item.quantity - 1)}
                      className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.dish.id, item.quantity + 1)}
                      className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Calculation & Taxes (Amman luxury regulations) */}
            <div className="p-5 bg-[#171411] border-t border-[#2d251a] space-y-3">
              {/* Gratuity Tip Selection */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">
                  {lang === 'en' ? 'Staff Gratuity / Tip:' : 'إكرامية الفريق:'}
                </span>
                <div className="flex items-center gap-1.5">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setTipPercentage(pct)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                        tipPercentage === pct
                          ? 'bg-[#d4af37] text-black border-[#d4af37]'
                          : 'bg-[#241f19] text-white/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {pct === 0 ? (lang === 'en' ? 'None' : 'بدون') : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                <div className="flex justify-between text-white/70">
                  <span>{lang === 'en' ? 'Subtotal:' : 'المجموع الفرعي:'}</span>
                  <span className="font-mono">{subtotal.toFixed(2)} JOD</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>{lang === 'en' ? 'Hospitality Service (10%):' : 'رسم الخدمة السياحية (١٠٪):'}</span>
                  <span className="font-mono">{serviceCharge.toFixed(2)} JOD</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>{lang === 'en' ? 'Sales Tax (16%):' : 'ضريبة المبيعات (١٦٪):'}</span>
                  <span className="font-mono">{salesTax.toFixed(2)} JOD</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-[#d4af37]">
                    <span>{lang === 'en' ? `Gratuity (${tipPercentage}%):` : `الإكرامية (${tipPercentage}٪):`}</span>
                    <span className="font-mono">+{tipAmount.toFixed(2)} JOD</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-[#3a3022] text-white font-bold">
                  <div className="flex flex-col">
                    <span className="text-sm">{lang === 'en' ? 'Total Amount Due:' : 'المجموع الإجمالي:'}</span>
                    <span className="text-[10px] text-white/40 font-mono">
                      ≈ ${grandTotalUSD.toFixed(2)} USD
                    </span>
                  </div>
                  <div className="text-xl font-serif-luxury text-[#d4af37]">
                    {grandTotal.toFixed(2)} JOD
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89326] text-black font-bold text-sm shadow-xl shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>{lang === 'en' ? 'Sending to Kitchen...' : 'جاري إرسال الطلب...'}</span>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Send Order to Kitchen' : 'تأكيد وإرسال للمطبخ'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
