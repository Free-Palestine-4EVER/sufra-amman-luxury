import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Sparkles,
  Utensils,
  Eye,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateWaiterResponse } from '../../services/aiWaiterService';
import type { Message } from '../../services/aiWaiterService';
import type { MenuItem } from '../../data/restaurantData';
import { RESTAURANT_INFO } from '../../data/restaurantData';
import type { CartItem } from '../Cart/CartModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
  currentTable: { id: string; nameEn: string; nameAr: string };
  cartItems: CartItem[];
  onAddToCart: (dish: MenuItem) => void;
  onUpdateQuantity: (dishId: string, quantity: number) => void;
  onClearCart: () => void;
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
  onClearCart,
  onOpen3D
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'waiter',
      textEn: `Ahlan wa Sahlan to Sufra Amman! I am Karam, your personal Gastronomy Concierge & AI Waiter at ${currentTable.nameEn}. May I recommend Jordan's national pride, our Royal Mansaf Baladi, or guide you through our stone-oven specialties? You can also order and checkout directly with me anytime!`,
      textAr: `أهلاً وسهلاً بكم في مطعم سفرة عمّان! أنا كرم، نادلكم الذكي ومستشاركم للضيافة على ${currentTable.nameAr}. يسعدني أن أرشح لكم منسفنا البلدي الملكي، أو أساعدكم في اختيار أشهى فخارات الحجر والمشاوي. بإمكانكم إتمام الطلب وإرساله للمطبخ مباشرة هنا في المحادثة!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderStage, setOrderStage] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt suggestions
  const quickPromptsEn = [
    "🚀 Send Order to Kitchen",
    "👑 Tell me about the Royal Mansaf",
    "🥩 Recommend best charcoal grills",
    "🌱 Vegetarian specialties",
    "🍹 What drink pairs with meat?",
    "🍨 Best Levantine dessert",
    "🛎️ Call table waiter"
  ];

  const quickPromptsAr = [
    "🚀 إتمام وإرسال الطلب للمطبخ",
    "👑 حدثني عن المنسف البلدي وجميد الكرك",
    "🥩 رشح لي أفضل المشاوي والصاجيات",
    "🌱 خيارات وأطباق نباتية",
    "🍹 ما المشروب المناسب مع اللحم؟",
    "🍨 أفضل حلوى ملكية للختام",
    "🛎️ استدعاء نادل الطاولة"
  ];

  const currentPrompts = lang === 'en' ? quickPromptsEn : quickPromptsAr;

  // Calculate bill totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );
  const serviceCharge = subtotal * RESTAURANT_INFO.serviceRate;
  const salesTax = (subtotal + serviceCharge) * RESTAURANT_INFO.taxRate;
  const total = subtotal + serviceCharge + salesTax;
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, orderPlaced]);

  // Authentic Arabic Voice Synthesis Engine
  const speakRealArabic = (arabicText: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean text: strip emojis, bullet points, and trim long essays to natural conversational sentences
    const cleanSpeech = arabicText
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // strip all emojis
      .replace(/[#*_-]/g, ' ')
      .split(/[.!؟\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 2)
      .join('، ');

    const textToSpeak = cleanSpeech.length > 0 ? cleanSpeech : arabicText;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.08; // Natural, lively, fluent Levantine conversational speed (no slow-motion!)
    utterance.pitch = 1.02; // Warm, crisp, engaging tone

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice =
      voices.find((v) => v.lang.startsWith('ar') && (v.name.includes('Maged') || v.name.includes('Tarik') || v.name.includes('Laila') || v.name.includes('Mariam') || v.name.includes('Salma'))) ||
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

  // Complete & Send Order from Chat
  const handleCompleteOrderInChat = () => {
    if (cartItems.length === 0) {
      const emptyMsg: Message = {
        id: Date.now().toString(),
        sender: 'waiter',
        textEn: "Your table order is currently empty! Please choose from our Royal Mansaf or signature grills first, and I will gladly send it to the kitchen.",
        textAr: "طلب طاولتكم فارغ حالياً! يرجى اختيار بعض الأطباق الشهية كمنسفنا البلدي أو المشاوي أولاً، وسأقوم بإرسالها فوراً للمطبخ.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, emptyMsg]);
      speakRealArabic(emptyMsg.textAr);
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#e5c07b', '#997d26']
      });
    } catch {}

    setOrderPlaced(true);
    setOrderStage(1);

    const orderNumber = `SF-${Math.floor(1000 + Math.random() * 9000)}`;

    const confirmMsg: Message = {
      id: Date.now().toString(),
      sender: 'waiter',
      textEn: `🎉 Excellent! Your table order (#${orderNumber}) has been officially sent to Chef Abu Omar at the stone ovens! Total: ${total.toFixed(2)} JOD (${(total * 1.41).toFixed(2)} USD). Our kitchen team has fired the oak charcoal and is preparing your feast now!`,
      textAr: `🎉 ألف مبارك! تم إرسال طلبكم الرسمي برقم (#${orderNumber}) مباشرة إلى شيف مطعم سفرة عند مواقد الحجر والفخار! المجموع: ${total.toFixed(2)} دينار أردني. يجري الآن إعداد وليمتكم بكل عناية وجودة!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, confirmMsg]);
    speakRealArabic(`تم إرسال طلبكم بنجاح إلى شيف المطبخ وموقد الحطب، ألف صحة وعافية! سنوافيكم بمراحل التحضير حالاً.`);

    // Progress through live kitchen stages
    setTimeout(() => setOrderStage(2), 3500);
    setTimeout(() => setOrderStage(3), 7000);
    setTimeout(() => {
      setOrderStage(4);
      onClearCart();
    }, 11000);
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

    // Check if user is asking to checkout or send order
    const lower = textToSend.toLowerCase();
    const isCheckoutQuery =
      lower.includes('checkout') ||
      lower.includes('finish') ||
      lower.includes('send order') ||
      lower.includes('place order') ||
      lower.includes('complete') ||
      lower.includes('bill') ||
      textToSend.includes('حساب') ||
      textToSend.includes('إتمام') ||
      textToSend.includes('ارسل') ||
      textToSend.includes('أرسل') ||
      textToSend.includes('طلب');

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

    if (isCheckoutQuery && cartItems.length > 0) {
      setTimeout(() => {
        setIsTyping(false);
        handleCompleteOrderInChat();
      }, 700);
      return;
    }

    setTimeout(() => {
      const waiterResponse = generateWaiterResponse(textToSend, lang, currentTable.nameEn);
      setIsTyping(false);
      setMessages((prev) => [...prev, waiterResponse]);
      speakRealArabic(waiterResponse.textAr);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl transition-all">
      <div className="relative w-full max-w-xl h-[92vh] sm:h-[700px] bg-[#120f0d] border border-[#d4af37]/45 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
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
              className={`text-[11px] whitespace-nowrap px-3.5 py-1.5 rounded-full border transition font-medium ${
                idx === 0 && totalCartCount > 0
                  ? 'gold-gradient-btn text-black font-bold border-[#d4af37]'
                  : 'bg-[#1e1913] hover:bg-[#2c241b] text-white/80 hover:text-[#f7ecd2] border-[#d4af37]/25 hover:border-[#d4af37]'
              }`}
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

              {/* Recommended Dish Cards inside Chat */}
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

          {/* Live Kitchen Preparation Tracker inside Chat if order is active */}
          {orderPlaced && (
            <div className="p-4 rounded-3xl bg-[#1b1510] border-2 border-[#d4af37] shadow-2xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#2d2417] pb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  <h4 className="text-sm font-bold text-white font-serif-luxury">
                    {lang === 'en' ? 'Live Kitchen Status' : 'حالة المطبخ المباشرة'}
                  </h4>
                </div>
                <span className="text-[10px] text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-0.5 rounded-full font-bold">
                  {currentTable.id}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { step: 1, labelEn: 'Received', labelAr: 'استلام', icon: '📝' },
                  { step: 2, labelEn: 'Cooking', labelAr: 'الطهي', icon: '🔥' },
                  { step: 3, labelEn: 'Plating', labelAr: 'التزيين', icon: '✨' },
                  { step: 4, labelEn: 'Served!', labelAr: 'التقديم!', icon: '🍽️' },
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`p-2 rounded-xl border text-[11px] flex flex-col items-center gap-1 transition-all ${
                      orderStage >= s.step
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f7ecd2] font-bold shadow-md'
                        : 'bg-black/30 border-white/5 text-white/30'
                    }`}
                  >
                    <span className="text-sm">{s.icon}</span>
                    <span>{lang === 'en' ? s.labelEn : s.labelAr}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#d4af37] text-center font-medium">
                {orderStage === 1 && (lang === 'en' ? 'Maître d\' Karam registered your order.' : 'تم تسجيل طلبكم رسمياً في نظام الصالة.')}
                {orderStage === 2 && (lang === 'en' ? 'Stone ovens and charcoal grills fired!' : 'قيد الطهي على موقد الحجر والشواية!')}
                {orderStage === 3 && (lang === 'en' ? 'Plating with baladi jameed and toasted nuts.' : 'التزيين بالسمن البلدي واللوز والصنوبر المحمص.')}
                {orderStage === 4 && (lang === 'en' ? 'Delivering to your table right now! Sahtain wa Afiah.' : 'في طريقه إلى طاولتكم الآن! صحتين وعافية.')}
              </p>
            </div>
          )}

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

        {/* IN-CHAT ORDER SUMMARY & INSTANT CHECKOUT BAR */}
        {totalCartCount > 0 && !orderPlaced && (
          <div className="px-4 py-3 bg-[#191410] border-t border-[#d4af37]/35 flex items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
                  {lang === 'en' ? `${totalCartCount} Dishes in Order` : `${totalCartCount} أطباق في الطلب`}
                </div>
                <div className="text-sm font-serif-luxury font-bold text-[#d4af37]">
                  {total.toFixed(2)} JOD <span className="text-[11px] text-white/40 font-mono">({(total * 1.41).toFixed(2)} USD)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCompleteOrderInChat}
              className="px-5 py-2.5 gold-gradient-btn text-black font-extrabold text-xs rounded-xl shadow-xl hover:scale-[1.02] active:scale-98 transition flex items-center gap-1.5"
            >
              <span>{lang === 'en' ? 'Send Order to Kitchen' : 'إرسال الطلب للمطبخ'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3] rtl:rotate-180" />
            </button>
          </div>
        )}

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
                  ? 'Ask Karam, add dishes, or type "Send Order to Kitchen"...'
                  : 'اسأل كرم، أضف أطباقك، أو اكتب "أرسل الطلب للمطبخ"...'
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
