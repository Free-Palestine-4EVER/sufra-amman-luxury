import React, { useState } from 'react';
import type { MenuItem } from '../../data/restaurantData';
import { X, Sparkles, Clock, Flame, Eye, Plus, Minus, Check, Info } from 'lucide-react';

interface Props {
  dish: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
  onAddToCart: (dish: MenuItem, options?: any) => void;
  onOpen3D: (dish: MenuItem) => void;
}

export const DishDetailModal: React.FC<Props> = ({
  dish,
  isOpen,
  onClose,
  lang,
  onAddToCart,
  onOpen3D
}) => {
  if (!isOpen || !dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  // Extras calculation
  const portionAdjustment = dish.customizationOptions?.portionSizes?.[selectedPortion]?.priceAdjustment || 0;
  const extrasTotal = selectedExtras.reduce((sum, extraName) => {
    const extra = dish.customizationOptions?.extras?.find(e => e.nameEn === extraName);
    return sum + (extra ? extra.price : 0);
  }, 0);
  const unitPrice = dish.price + portionAdjustment + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extraName: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraName) ? prev.filter(e => e !== extraName) : [...prev, extraName]
    );
  };

  const handleAdd = () => {
    onAddToCart({
      ...dish,
      price: unitPrice
    }, {
      quantity,
      portion: dish.customizationOptions?.portionSizes?.[selectedPortion]?.name,
      extras: selectedExtras,
      notes: specialInstructions
    });

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-[#141210] border border-[#d4af37]/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Image with Badges */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={dish.image}
            alt={dish.nameEn}
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/60" />

          {/* Close & 3D button */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {dish.has3DPreview && (
                <button
                  onClick={() => onOpen3D(dish)}
                  className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold backdrop-blur-md border border-white/20 transition flex items-center gap-1.5 shadow-lg"
                >
                  <Eye className="w-4 h-4 text-[#d4af37] hover:text-black" />
                  <span>{lang === 'en' ? '3D / AR View' : 'معاينة ثلاثية الأبعاد'}</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition backdrop-blur-md border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dietary tags */}
          <div className="absolute bottom-4 left-5 flex items-center gap-2 flex-wrap">
            {dish.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/40"
              >
                {tag.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {lang === 'en' ? dish.nameEn : dish.nameAr}
              </h2>
              <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  {dish.preparationTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  {dish.calories} kcal
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-serif-luxury font-bold text-[#d4af37]">
                {unitPrice.toFixed(2)} JOD
              </div>
              <div className="text-[10px] text-white/40 font-mono">
                ≈ ${(unitPrice * 1.41).toFixed(2)} USD
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/80 leading-relaxed">
            {lang === 'en' ? dish.descriptionEn : dish.descriptionAr}
          </p>

          {/* Cultural Heritage Story */}
          {dish.culturalStory && (
            <div className="p-4 rounded-2xl bg-[#1e1b17] border border-[#d4af37]/25 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'en' ? 'Heritage & Story' : 'أصل الحكاية والتراث'}</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed italic">
                "{dish.culturalStory}"
              </p>
            </div>
          )}

          {/* Portion Selection (if available) */}
          {dish.customizationOptions?.portionSizes && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                {lang === 'en' ? 'Choose Portion Size:' : 'اختر حجم الطبق:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dish.customizationOptions.portionSizes.map((portion, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPortion(index)}
                    className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${
                      selectedPortion === index
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#f3e5ab]'
                        : 'bg-[#1a1714] border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <span>{portion.name}</span>
                    {portion.priceAdjustment > 0 && (
                      <span className="text-[#d4af37] font-semibold font-mono">
                        +{portion.priceAdjustment.toFixed(2)} JOD
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras / Add-ons (if available) */}
          {dish.customizationOptions?.extras && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                {lang === 'en' ? 'Heritage Enhancements & Extras:' : 'إضافات ومطيبات:'}
              </label>
              <div className="space-y-2">
                {dish.customizationOptions.extras.map((extra) => {
                  const isChecked = selectedExtras.includes(extra.nameEn);
                  return (
                    <button
                      key={extra.nameEn}
                      onClick={() => toggleExtra(extra.nameEn)}
                      className={`w-full p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                        isChecked
                          ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#f3e5ab]'
                          : 'bg-[#1a1714] border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked
                              ? 'bg-[#d4af37] border-[#d4af37] text-black'
                              : 'border-white/30'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{lang === 'en' ? extra.nameEn : extra.nameAr}</span>
                      </div>
                      <span className="text-[#d4af37] font-semibold font-mono">
                        +{extra.price.toFixed(2)} JOD
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pairing Recommendation */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs">
            <span className="text-xl">🥂</span>
            <div className="flex-1">
              <span className="font-bold text-[#d4af37] block">
                {lang === 'en' ? 'Sommelier / Concierge Pairing:' : 'تنسيق الشيف للمشروب:'}
              </span>
              <span className="text-white/70">
                {lang === 'en' ? dish.pairingSuggestionEn : dish.pairingSuggestionAr}
              </span>
            </div>
          </div>

          {/* Allergens Notice */}
          {dish.allergens.length > 0 && (
            <div className="text-[11px] text-white/50 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {lang === 'en' ? 'Allergens Notice:' : 'تنبيه الحساسية الغذائية:'}{' '}
                {dish.allergens.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-[#1a1714] border-t border-[#2d251a] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Counter */}
          <div className="flex items-center gap-3 bg-[#241f19] border border-white/10 rounded-xl p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-white w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89326] text-black font-bold text-sm shadow-xl shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-between"
          >
            <span>{addedToast ? (lang === 'en' ? '✓ Added to Order!' : '✓ تمت الإضافة!') : (lang === 'en' ? 'Add to Table Order' : 'إضافة للطلب')}</span>
            <span className="font-mono text-sm">{totalPrice.toFixed(2)} JOD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
