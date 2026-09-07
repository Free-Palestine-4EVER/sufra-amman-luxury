import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Sparkles, Utensils, Eye, Plus, Minus, Check } from 'lucide-react';
import { generateWaiterResponse } from '../../services/aiWaiterService';
import type { Message } from '../../services/aiWaiterService';
import type { MenuItem } from '../../data/restaurantData';
import type { CartItem } from '../Cart/CartModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
  currentTable: { id: string; nameEn: string; nameAr: string };
  cartItems: CartItem[];
  onAddToCart: (dish: MenuItem) => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onOpen3D: (dish: MenuItem) => void;
}

export const AIWaiterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  currentTable,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onOpen3D
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'waiter',
      textEn: `Ahlan wa Sahlan to Sufra Amman! I am Karam, your personal Gastronomy Concierge & AI Waiter at ${currentTable.nameEn}. May I recommend Jordan's national pride, our Royal Mansaf Baladi, or guide you through our stone-oven specialties?`,
      textAr: `أهلاً وسهلاً بكم في مطعم سفرة عمّان! أنا كرم، نادلكم الذكي ومستشاركم للضيافة على ${currentTable.nameAr}. يسعدني أن أرشح لكم منسفنا البلدي الملكي، أو أساعدكم في اختيار أشهى فخارات الحجر والمشاوي. تفضلوا كيف أخدمكم؟`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt suggestions
  const quickPromptsEn = [
    "👑 Tell me about the Royal Mansaf",
    "🥩 Recommend best charcoal grills",
    "🌱 Vegetarian specialties",
    "🍹 What drink pairs with meat?",
    "🍨 Best Levantine dessert",
    "🛎️ Call table waiter"
  ];

  const quickPromptsAr = [
    "👑 حدثني عن المنسف البلدي وجميد الكرك",
    "🥩 رشح لي أفضل المشاوي والصاجيات",
    "🌱 خيارات وأطباق نباتية",
    "🍹 ما المشروب المناسب مع اللحم؟",
    "🍨 أفضل حلوى ملكية للختام",
    "🛎️ استدعاء نادل الطاولة"
  ];

  const currentPrompts = lang === 'en' ? quickPromptsEn : quickPromptsAr;

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Authentic Arabic Voice Synthesis Engine
  // Always speaks authentic Arabic regardless of user interface language
  const speakRealArabic = (arabicText: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(arabicText);
    utterance.rate = 0.88; // Dignified, calm hospitality cadence
    utterance.pitch = 0.98; // Natural warm tone

    // Hunt for native Arabic voices (Tarik, Maged, Laila, Mariam, Google Arabic, etc.)
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice =
      voices.find((v) => v.lang.startsWith('ar') && (v.name.includes('Maged') || v.name.includes('Tarik') || v.name.includes('Laila'))) ||
      voices.find((v) => v.lang.startsWith('ar')) ||
      voices.find((v) => v.lang.includes('ar-') || v.lang.includes('ara'));

    if (arabicVoice) {
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang;
    } else {
      utterance.lang = 'ar-SA';
    }

    window.speechSynthesis.speak(utterance);
  };

  // Helper to get quantity of dish in cart
  const getItemQuantity = (dishId: string) => {
    const found = cartItems.find((item) => item.dish.id === dishId);
    return found ? found.quantity : 0;
  };

  const handleDishAction = (dish: MenuItem, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (currentQty === 0 && delta > 0) {
      onAddToCart(dish);
      setToastMessage(lang === 'en' ? `Added ${dish.nameEn} to Table Order` : `تمت إضافة ${dish.nameAr} إلى الطلب`);
    } else {
      onUpdateQuantity(dish.id, newQty);
      if (newQty > currentQty) {
        setToastMessage(lang === 'en' ? `Updated ${dish.nameEn} (x${newQty})` : `تم تحديث ${dish.nameAr} (×${newQty})`);
      }
    }

    setTimeout(() => setToastMessage(null), 2000);
  };

  // Voice Recognition (Microphone)
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(lang === 'en' ? 'Voice recognition is not supported in this browser. Please type your message.' : 'التعرف الصوتي غير مدعوم في هذا المتصفح، يرجى كتابة الرسالة.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'ar' ? 'ar-JO' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleSend = (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      textEn: textToSend,
      textAr: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const waiterResponse = generateWaiterResponse(textToSend, lang, currentTable.nameEn);
      setIsTyping(false);
      setMessages((prev) => [...prev, waiterResponse]);
      // Speak authentic Arabic line regardless of written language
      speakRealArabic(waiterResponse.textAr);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl transition-all">
      <div className="relative w-full max-w-xl h-[92vh] sm:h-[680px] bg-[#120f0d] border border-[#d4af37]/45 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Luxury Gold Filigree Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#2d2417] bg-[#17130f]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f7ecd2] to-[#b89326] p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#15110d] rounded-[14px] flex items-center justify-center text-2xl">
                  🤵
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#120f0d] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base font-serif-luxury">
                  {lang === 'en' ? 'Karam (كرم)' : 'كرم - النادل الذكي'}
                </h3>
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40">
                  {lang === 'en' ? 'Sufra Maître d\'' : 'كبير مضيفي سفرة'}
                </span>
              </div>
              <p className="text-xs text-white/60">
                {lang === 'en' ? `Dedicated Butler at ${currentTable.nameEn}` : `مضيفكم الخاص على ${currentTable.nameAr}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Arabic Voice Toggle Badge */}
            <button
              onClick={() => {
                const nextState = !voiceEnabled;
                setVoiceEnabled(nextState);
                if (!nextState && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 ${
                voiceEnabled
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f7ecd2]'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
              title={voiceEnabled ? 'Arabic Voice Active' : 'Mute Voice'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-[#d4af37]" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[10px] font-bold hidden sm:inline text-[#d4af37]">عربي</span>
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Cart Feedback Toast */}
        {toastMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-[#d4af37] text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-[#17130f] border-b border-[#251e14] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
          {currentPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt.replace(/^[^\w\s\u0600-\u06FF]+/, '').trim())}
              className="text-[11px] whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#1e1913] hover:bg-[#2c241b] text-white/80 hover:text-[#f7ecd2] border border-[#d4af37]/25 hover:border-[#d4af37] transition font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#120f0d] to-[#0a0907]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xl ${
                  msg.sender === 'user'
                    ? 'gold-gradient-btn text-black font-semibold rounded-br-xs'
                    : 'bg-[#181410] border border-[#352c1e] text-[#f7f2ea] rounded-bl-xs'
                }`}
              >
                <p>{lang === 'en' ? msg.textEn : msg.textAr}</p>
                <div
                  className={`text-[10px] mt-1.5 opacity-60 flex justify-end ${
                    msg.sender === 'user' ? 'text-black' : 'text-[#d4af37]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Recommended Dish Cards inside Chat with LIVE Cart Controls */}
              {msg.recommendedDishes && msg.recommendedDishes.length > 0 && (
                <div className="w-full max-w-[94%] mt-3 space-y-2">
                  <div className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase flex items-center gap-1.5">
                    <Utensils className="w-3 h-3 text-[#d4af37]" />
                    <span>{lang === 'en' ? 'Chef Recommendations (Tap to Order):' : 'أطباق مقترحة من الشيف (أضف لطاولتك):'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.recommendedDishes.map((dish) => {
                      const qty = getItemQuantity(dish.id);
                      const isInCart = qty > 0;

                      return (
                        <div
                          key={dish.id}
                          className={`rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 shadow-lg ${
                            isInCart
                              ? 'bg-[#1e1913] border-2 border-[#d4af37] shadow-[#d4af37]/15'
                              : 'bg-[#16120e] border border-white/10 hover:border-[#d4af37]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.image}
                              alt={dish.nameEn}
                              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-white truncate">
                                  {lang === 'en' ? dish.nameEn : dish.nameAr}
                                </h4>
                              </div>
                              <div className="text-xs font-serif-luxury font-bold text-[#d4af37] mt-0.5">
                                {dish.price.toFixed(2)} JOD
                              </div>

                              {isInCart && (
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full mt-1">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>{lang === 'en' ? `${qty} in Order` : `${qty} في الطلب`}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: Dynamic Cart Addition & 3D */}
                          <div className="mt-3 flex items-center gap-2">
                            {isInCart ? (
                              <div className="flex-1 flex items-center justify-between bg-[#292219] border border-[#d4af37]/60 rounded-xl px-2 py-1">
                                <button
                                  onClick={() => handleDishAction(dish, qty, -1)}
                                  className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold text-[#f7ecd2] px-2 font-mono">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => handleDishAction(dish, qty, 1)}
                                  className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDishAction(dish, 0, 1)}
                                className="flex-1 py-2 px-3 gold-gradient-btn text-black text-xs font-bold rounded-xl transition text-center shadow-md flex items-center justify-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                <span>{lang === 'en' ? 'Add to Table' : 'إضافة للطلب'}</span>
                              </button>
                            )}

                            {dish.has3DPreview && (
                              <button
                                onClick={() => onOpen3D(dish)}
                                className="p-2 rounded-xl bg-white/10 hover:bg-[#d4af37] text-white hover:text-black transition border border-white/15"
                                title="Inspect dish in 3D"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#d4af37] bg-[#181410] border border-[#352c1e] px-4 py-2.5 rounded-2xl w-fit">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-white/70">
                {lang === 'en' ? 'Karam is preparing guidance...' : 'كرم يحضر إجابتكم...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#17130f] border-t border-[#2d2417]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl border transition ${
                isListening
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : 'bg-[#1e1913] border-[#d4af37]/30 text-[#d4af37] hover:bg-[#2b231a]'
              }`}
              title={isListening ? 'Listening...' : 'Speak your question or order'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'Ask Karam about Mansaf, wine pairings, or call table captain...'
                  : 'اسأل كرم عن المنسف، المشاوي، أو اطلب ماء وخبز طازج...'
              }
              className="flex-1 bg-[#0f0d0b] border border-white/10 focus:border-[#d4af37] text-white text-sm rounded-2xl px-4 py-3 outline-none transition placeholder:text-white/35"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-3 gold-gradient-btn disabled:opacity-30 text-black font-bold rounded-2xl shadow-md transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {isListening && (
            <div className="text-[11px] text-center text-red-400 mt-1.5 animate-pulse font-medium">
              {lang === 'en' ? '🎙️ Listening to your voice... Speak now' : '🎙️ جاري الاستماع لصوتكم... تفضل بالتحدث'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
