import { MENU_ITEMS } from '../data/restaurantData';
import type { MenuItem } from '../data/restaurantData';

export interface Message {
  id: string;
  sender: 'user' | 'waiter';
  textEn: string;
  textAr: string;
  timestamp: string;
  recommendedDishes?: MenuItem[];
  actionType?: 'call_waiter' | 'view_bill' | 'add_to_cart';
}

// Sophisticated gastronomy intelligence engine for Sufra Restaurant
export function generateWaiterResponse(
  userQuery: string,
  _lang: 'en' | 'ar',
  tableId: string
): Message {
  const query = userQuery.toLowerCase().trim();
  const id = Date.now().toString();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Water or Bread Request
  if (query.includes('water') || query.includes('ماء') || query.includes('مية') || query.includes('شرب')) {
    return {
      id,
      sender: 'waiter',
      textEn: `Right away! I have alerted our floor captain. Chilled bottled mineral water is being brought to ${tableId} immediately. Would you like sparkling or still?`,
      textAr: `حاضر سيدي! تم إخطار كابتن الصالة حالاً، وسيتم تقديم مياه معدنية نقية وباردة إلى ${tableId} في لحظات. هل تفضلونها غازية أم طبيعية؟`,
      timestamp,
      actionType: 'call_waiter'
    };
  }

  if (query.includes('bread') || query.includes('خبز') || query.includes('طابون') || query.includes('شراك')) {
    const bread = MENU_ITEMS.find(i => i.id === 'sufra-balloon-bread');
    return {
      id,
      sender: 'waiter',
      textEn: `Our baker has just pulled a batch of puffed balloon bread from the stone oven! A warm basket is on its way to ${tableId}. Enjoy the fragrance!`,
      textAr: `خبازنا سحب لتوه سلة خبز منفوخ طازج من بيت النار الحجري! وهي في طريقها إلى ${tableId} الآن ساخنة وبألف صحة وهنا.`,
      timestamp,
      recommendedDishes: bread ? [bread] : []
    };
  }

  // 2. Call human waiter
  if (query.includes('call waiter') || query.includes('waiter') || query.includes('نادي الويتر') || query.includes('جرسون') || query.includes('نادل') || query.includes('مساعدة')) {
    return {
      id,
      sender: 'waiter',
      textEn: `🛎️ Your table captain has been notified! A team member is heading to ${tableId} right now to assist you in person.`,
      textAr: `🛎️ تم إشعار كابتن الصالة بنجاح! أحد أفراد فريق سفرة في طريقه إلى ${tableId} لخدمتكم فوراً.`,
      timestamp,
      actionType: 'call_waiter'
    };
  }

  // 3. Mansaf inquiries
  if (query.includes('mansaf') || query.includes('منسف') || query.includes('جميد') || query.includes('jameed')) {
    const mansaf = MENU_ITEMS.find(i => i.id === 'mansaf-baladi')!;
    return {
      id,
      sender: 'waiter',
      textEn: `Ah, our crowning pride: The Royal Jordanian Mansaf Baladi! Prepared strictly according to heritage Bedouin tradition using authentic sundried fermented goat yogurt (Jameed from Karak), tender baladi lamb, fragrant turmeric saffron rice, paper-thin shrak bread, and sizzling pine nuts. Pour the piping hot jameed over your rice and enjoy!`,
      textAr: `أهلاً بك في فخر المطبخ الأردني وسيد سفرتنا: المنسف البلدي الملكي! يطهى على الأصول بلحم الخروف البلدي الطري في مرق جميد الكرك الأصيل الحامض والغني، فوق أرز عنبر مطيب بالزعفران وخبز الشراك الرقيق، ومزين بالصنوبر واللوز البلدي. أنصحكم بتجربته بكل تأكيد!`,
      timestamp,
      recommendedDishes: [mansaf]
    };
  }

  // 4. Vegetarian / Vegan recommendations
  if (query.includes('vegetarian') || query.includes('vegan') || query.includes('plant') || query.includes('نباتي') || query.includes('خضار') || query.includes('بدون لحم')) {
    const vegDishes = MENU_ITEMS.filter(i => i.tags.includes('vegetarian')).slice(0, 3);
    return {
      id,
      sender: 'waiter',
      textEn: `We have an exquisite selection of authentic Levantine vegetarian dishes prepared with cold-pressed Ajloun olive oil! I especially recommend our Smoked Mutabbal Bathenjan, Charred Halloumi with Ajloun Mountain Honey, and hand-rolled Yalangi Vine Leaves.`,
      textAr: `لدينا تشكيلة فاخرة من الأطباق النباتية المحضرة بزيت الزيتون العجلوني البكر! أرشح لكم المتبل المدخن على الحطب، والجبن الحلوم المشوي بالعسل البري والزعتر، واليالنجي ورق العنب الشهي.`,
      timestamp,
      recommendedDishes: vegDishes
    };
  }

  // 5. Meat / Grills / Lamb recommendations
  if (query.includes('meat') || query.includes('grill') || query.includes('lamb') || query.includes('kebab') || query.includes('لحم') || query.includes('مشاوي') || query.includes('كباب') || query.includes('خروف') || query.includes('صاجية')) {
    const meatDishes = [
      MENU_ITEMS.find(i => i.id === 'mashawi-sufra-royal')!,
      MENU_ITEMS.find(i => i.id === 'sajiet-ghanam-baladi')!,
      MENU_ITEMS.find(i => i.id === 'fukharet-kufta-tahini')!
    ].filter(Boolean);
    return {
      id,
      sender: 'waiter',
      textEn: `For meat connoisseurs, Sufra uses only premium pasture-raised local Jordanian lamb. Our Royal Mixed Charcoal Grill, sizzling Sajiet Ghanam Baladi on cast-iron, and stone-baked Fukharet Kufta in rich sesame tahini are legendary!`,
      textAr: `لعشاق اللحوم الأصيلة، نستخدم في سفرة حصرياً اللحم البلدي الطازج. أنصحكم بشدة بمشاوي سفرة الملكية على جمر السنديان، أو صاجية الغنم البلدية التي تطشطش على الطاولة، وفخارة الكفتة بالطحينية!`,
      timestamp,
      recommendedDishes: meatDishes
    };
  }

  // 6. Drink & beverage pairings
  if (query.includes('drink') || query.includes('beverage') || query.includes('juice') || query.includes('مشروب') || query.includes('عصير') || query.includes('ليمون') || query.includes('قهوة') || query.includes('coffee') || query.includes('شاي')) {
    const drinks = MENU_ITEMS.filter(i => i.category === 'beverages').slice(0, 3);
    return {
      id,
      sender: 'waiter',
      textEn: `To complement your meal, our refreshing Limonana (frozen mint lemonade) is Amman's beloved refresher, while our Sharab Al-Ward infused with Damascus rose petals is regal and aromatic. And of course, ceremonial cardamom Arabic coffee (Qahwa Sada) to finish!`,
      textAr: `لتكتمل لذة وجبتكم، لا تفوتوا ليموناضة سفرة بالنعناع البلدي المنعش، أو شراب الورد الشامي الفاخر ببتلات الورد الجوري. ولختام المائدة نقدم لكم دلة القهوة الأردنية السادة بالهيل الأخضر الفواح.`,
      timestamp,
      recommendedDishes: drinks
    };
  }

  // 7. Dessert recommendations
  if (query.includes('dessert') || query.includes('sweet') || query.includes('sugar') || query.includes('حلو') || query.includes('حلويات') || query.includes('كنافة') || query.includes('ام علي') || query.includes('قشطة')) {
    const desserts = MENU_ITEMS.filter(i => i.category === 'desserts').slice(0, 3);
    return {
      id,
      sender: 'waiter',
      textEn: `For the sweet finale: Our Um Ali Royale with clotted Ashta and pistachios is served bubbling warm from the oven, and the crispy Pistachio Osmalieh offers a crisp, perfumed indulgence!`,
      textAr: `لحلو الختام الملكي: أنصحكم بطاجن أم علي الملكية بالقشطة البلدية والفستق الحلبي الساخن من الفرن، أو العثملية المقرمشة بالقشطة الطازجة وماء الزهر!`,
      timestamp,
      recommendedDishes: desserts
    };
  }

  // 8. Bill / Check inquiry
  if (query.includes('bill') || query.includes('check') || query.includes('فاتورة') || query.includes('حساب') || query.includes('كم الحساب')) {
    return {
      id,
      sender: 'waiter',
      textEn: `You can review your detailed table order, 10% hospitality service, and 16% sales tax anytime in the Order & Bill tab. I can also request your printed receipt whenever you are ready!`,
      textAr: `يمكنكم مراجعة تفاصيل حساب الطاولة وضريبة المبيعات ورسم الخدمة في تبويب الفاتورة والطلب. وسيسعدني أيضاً طباعة الفاتورة لكم متى رغبتم!`,
      timestamp,
      actionType: 'view_bill'
    };
  }

  // 9. Romantic dinner or 2-person recommendation
  if (query.includes('two') || query.includes('couple') || query.includes('romantic') || query.includes('شخصين') || query.includes('زوجين') || query.includes('رومانسي')) {
    const pairMenu = [
      MENU_ITEMS.find(i => i.id === 'hummus-sufra-special')!,
      MENU_ITEMS.find(i => i.id === 'tabbouleh-baladiyeh')!,
      MENU_ITEMS.find(i => i.id === 'mashawi-sufra-royal')!,
      MENU_ITEMS.find(i => i.id === 'um-ali-royale')!
    ].filter(Boolean);
    return {
      id,
      sender: 'waiter',
      textEn: `For a memorable dining experience for two: Begin with our warm Hummus Sufra with Lamb and a vibrant Tabbouleh, followed by our Grand Charcoal Royal Mixed Grill, and conclude with the warm Um Ali Royale to share. An unforgettable culinary voyage!`,
      textAr: `لتجربة استثنائية لشخصين: أنصحكم بالبدء بحمص سفرة باللحم والتبولة البلدية بالرمان، يليه طبق مشاوي سفرة الملكية المشكلة، واختتام الجلسة بطاجن أم علي الملكية للمشاركة!`,
      timestamp,
      recommendedDishes: pairMenu
    };
  }

  // General hospitality fallback
  const chefSpecials = MENU_ITEMS.filter(i => i.tags.includes('chef_choice')).slice(0, 3);
  return {
    id,
    sender: 'waiter',
    textEn: `Ahlan wa Sahlan! It is our honor to host you at Sufra Amman. As your AI Gastronomy Concierge, I can guide you through our heritage dishes, wine & mocktail pairings, explain Jordan's culinary history, or customize dishes for your dietary preferences. How may I serve you today?`,
    textAr: `أهلاً وسهلاً بكم في مطعم سفرة عمّان! بصفتي نادلكم ومستشاركم الذكي للضيافة، يسعدني إرشادكم عبر أشهى أطباق التراث، وتنسيق المشروبات، وشرح قصة المنسف الكركي، أو تخصيص الأطباق حسب رغباتكم. كيف أستطيع خدمتكم؟`,
    timestamp,
    recommendedDishes: chefSpecials
  };
}
