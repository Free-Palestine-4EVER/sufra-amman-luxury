export interface MenuItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
  price: number; // in JOD
  descriptionEn: string;
  descriptionAr: string;
  culturalStory: string;
  image: string;
  tags: ('chef_choice' | 'halal' | 'vegetarian' | 'gluten_free' | 'bestseller' | 'contains_nuts')[];
  calories: number;
  preparationTime: string;
  allergens: string[];
  pairingSuggestionEn: string;
  pairingSuggestionAr: string;
  has3DPreview?: boolean;
  modelType?: 'mansaf' | 'grill' | 'fukhara' | 'dessert' | 'drink';
  customizationOptions?: {
    spiceLevels?: string[];
    portionSizes?: { name: string; priceAdjustment: number }[];
    extras?: { nameEn: string; nameAr: string; price: number }[];
  };
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  descriptionEn: string;
  descriptionAr: string;
}

export const RESTAURANT_INFO = {
  nameEn: "Sufra Restaurant",
  nameAr: "مطعم سفرة",
  taglineEn: "The Pinnacle of Jordanian Royal Gastronomy",
  taglineAr: "قمة الضيافة وفنون الطهي الأردني الملكي",
  addressEn: "Rainbow Street, Jabal Amman, Jordan",
  addressAr: "شارع الرينبو، جبل عمّان، الأردن",
  phone: "+962 6 461 1468",
  hoursEn: "Daily: 12:00 PM – 11:30 PM",
  hoursAr: "يومياً: ١٢:٠٠ ظهراً – ١١:٣٠ مساءً",
  rating: 4.9,
  reviewsCount: 3840,
  taxRate: 0.16, // 16% Sales Tax in Jordan
  serviceRate: 0.10, // 10% Service Charge in Jordan fine dining
  accolades: [
    "MENA's 50 Best Restaurants",
    "Romero Group Culinary Heritage",
    "Royal Jordanian Patronage"
  ],
  storyEn: "Nestled in an evocative 1920s Ottoman-Levantine villa on Amman's historic Rainbow Street, Sufra preserves authentic Jordanian recipes. From the legendary Jameed of Karak to the earthen clay pot Fukharat baked over glowing coals, each dish honors centuries of Levantine hospitality.",
  storyAr: "يقع مطعم سفرة في فيلا عثمانية شامية تراثية تعود لعشرينيات القرن الماضي على شارع الرينبو في جبل عمّان العريق. يجسد سفرة جوهر المطبخ الأردني الأصيل، بدءاً من جميد الكرك البلدي وصولاً إلى فخارات الطين المطهوة على الجمر وخبز الطابون الطازج."
};

export const CATEGORIES: Category[] = [
  {
    id: "heritage_signature",
    nameEn: "Royal Signatures",
    nameAr: "روائع السفرة الملكية",
    icon: "Crown",
    descriptionEn: "Jordanian national treasures and celebrated heritage centerpieces",
    descriptionAr: "التحف الوطنية الأردنية الأصيلة وسيدة المائدة"
  },
  {
    id: "fukharat_hot",
    nameEn: "Clay Pot Fukharat & Hot Mezze",
    nameAr: "الفخارات والمقبلات الساخنة",
    icon: "Flame",
    descriptionEn: "Bubbling clay pots roasted in stone ovens with mountain herbs",
    descriptionAr: "فخارات تغلي في فرن الحجر وأطباق ساخنة بزيت الزيتون البكر"
  },
  {
    id: "cold_mezze",
    nameEn: "Cold Mezze & Salads",
    nameAr: "المقبلات الباردة والسلطات",
    icon: "Salad",
    descriptionEn: "Silky dips, vibrant garden herbs, and cold-pressed olive oils",
    descriptionAr: "مقبلات شاميّة باردة، زيت زيتون عجلوني، وأعشاب برية طازجة"
  },
  {
    id: "grills_sajiyat",
    nameEn: "Charcoal Grills & Sajiyat",
    nameAr: "المشاوي والصاجيات",
    icon: "Utensils",
    descriptionEn: "Prime cuts and sizzling Bedouin cast-iron platters over fruitwood coals",
    descriptionAr: "مشاوي على الفحم وصاجيات بدوية على نار الحطب"
  },
  {
    id: "fresh_bakery",
    nameEn: "Stone Oven Bakery",
    nameAr: "فرن الصاج والخبز الطازج",
    icon: "Wheat",
    descriptionEn: "Artisanal breads and wild thyme pies baked fresh to order",
    descriptionAr: "خبز سفرة المنفوخ ومناقيش الزعتر البلدي من الفرن مباشرة"
  },
  {
    id: "desserts",
    nameEn: "Royal Desserts",
    nameAr: "الحلويات الشرقية",
    icon: "Sparkles",
    descriptionEn: "Crisp phyllo, clotted Ashta cream, and blossom honey",
    descriptionAr: "كنافة نابلسية، قشطة بلدية طازجة، وقطر بماء الورد والزهر"
  },
  {
    id: "beverages",
    nameEn: "Artisanal Mocktails & Coffee",
    nameAr: "المشروبات والقهوة الأصيلة",
    icon: "Coffee",
    descriptionEn: "Refreshing Levantine botanicals and ceremonial cardamom coffee",
    descriptionAr: "عصائر ومشروبات طبيعية منعشة وقهوة أردنية بالهيل الزاكي"
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // --- HERITAGE SIGNATURES ---
  {
    id: "mansaf-baladi",
    nameEn: "Royal Jordanian Mansaf Baladi",
    nameAr: "المنسف الأردني البلدي الملكي",
    category: "heritage_signature",
    price: 19.50,
    descriptionEn: "The undisputed crown jewel of Jordan. Succulent baladi lamb slowly simmered in authentic aged Karaki Jameed yogurt broth, arranged over fragrant golden turmeric saffron rice, lined with whisper-thin shrak flatbread, and lavishly crowned with roasted pine nuts and Marcona almonds. Served with a steaming clay bowl of silky jameed broth.",
    descriptionAr: "سيد المائدة الأردنية والرمز الوطني الخالد. لحم خروف بلدي طري يُطبخ على مهل في مرق جميد الكرك الأصيل، يُقدم فوق طبقات من خبز الشراك الرقيق وأرز عنبر مطيب بالزعفران والكركم، ومزين بالصنوبر واللوز المقلي بالزبدة البلدية، مع طاسة جميد ساخنة.",
    culturalStory: "Recognized by UNESCO as intangible cultural heritage, Mansaf represents the soul of Jordanian Bedouin hospitality and generosity. Originating in Karak, the sundried fermented goat milk jameed gives the broth its unique tangy and rich profile.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "halal", "bestseller", "contains_nuts"],
    calories: 890,
    preparationTime: "15-20 min",
    allergens: ["Dairy (Jameed)", "Tree Nuts", "Gluten (Bread)"],
    pairingSuggestionEn: "Authentic Qahwa Sada (Arabic Coffee) with cardamom & fresh Limonana.",
    pairingSuggestionAr: "قهوة سادة أردنية بالهيل ولموناضة نعناع طازجة.",
    has3DPreview: true,
    modelType: "mansaf",
    customizationOptions: {
      portionSizes: [
        { name: "Single Royal Platter (شخص واحد)", priceAdjustment: 0 },
        { name: "Double Grand Feast (شخصين)", priceAdjustment: 16.00 }
      ],
      extras: [
        { nameEn: "Extra Clay Bowl of Karaki Jameed", nameAr: "طاسة جميد كركي إضافية", price: 3.00 },
        { nameEn: "Double Golden Pine Nuts & Almonds", nameAr: "مكسرات صنوبر ولوز إضافية", price: 2.50 },
        { nameEn: "Extra Sheet of Artisan Shrak Bread", nameAr: "رغيف شراك إضافي", price: 1.00 }
      ]
    }
  },
  {
    id: "magloubeh-zahra",
    nameEn: "Magloubeh Royal Lamb & Eggplant",
    nameAr: "مقلوبة لحم بلدي مع الباذنجان والزهرة",
    category: "heritage_signature",
    price: 16.50,
    descriptionEn: "The iconic Levantine upside-down feast. Layers of tender braised lamb, caramelized black eggplant, crispy spiced cauliflower, and long-grain basmati infused with 7-spice aromatics, inverted table-side and dusted with toasted nuts. Accompanied by chilled cucumber-mint laban.",
    descriptionAr: "الوليمة الشامية الشهيرة مقلوبة على الأصول. طبقات من اللحم البلدي المتبل، الباذنجان المقلي الذهبي، والزهرة مع أرز متبل ببهارات المقلوبة السبعة الفواحة، تقدم مع لبن بالخيار والنعناع المجفف.",
    culturalStory: "Tradition says that during historical celebrations in Jerusalem and Amman, this dish earned its name when it was dramatically flipped upside down before Sultan Salah al-Din, showcasing its stunning layered geometry.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "halal", "contains_nuts"],
    calories: 780,
    preparationTime: "20 min",
    allergens: ["Tree Nuts", "Dairy"],
    pairingSuggestionEn: "Chilled Cucumber Mint Labneh & Sharab Al-Ward.",
    pairingSuggestionAr: "لبن بالخيار والنعناع وشراب الورد الشامي.",
    has3DPreview: true,
    modelType: "mansaf"
  },

  // --- FUKHARAT & HOT MEZZE ---
  {
    id: "fukharet-kufta-tahini",
    nameEn: "Fukharet Kufta bil Tahini",
    nameAr: "فخارة كفتة بالطحينية البلدية",
    category: "fukharat_hot",
    price: 9.75,
    descriptionEn: "Char-grilled minced lamb and beef mixed with parsley, onion, and allspice, baked inside a traditional heavy clay pot beneath a velvety sesame tahini sauce, potato rounds, and pomegranate seeds. Sizzles directly from the oven.",
    descriptionAr: "لحم عجل وخروف مفروم بالبقدونس والبصل والبهارات، مخبوز في فخار الحجر تحت صلصة الطحينية السمسمية الغنية مع شرائح البطاطا وحبات الرمان.",
    culturalStory: "Baked in natural clay earthenware sourced from Jerash and Madaba potters, the stone traps heat evenly, caramelizing the edges of the tahini crust into smoky perfection.",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "halal", "bestseller", "gluten_free"],
    calories: 640,
    preparationTime: "15 min",
    allergens: ["Sesame (Tahini)"],
    pairingSuggestionEn: "Fresh hot stone-oven balloon bread & Fattoush.",
    pairingSuggestionAr: "خبز سفرة المنفوخ الساخن وسلطة فتوش بالدبس.",
    has3DPreview: true,
    modelType: "fukhara",
    customizationOptions: {
      extras: [
        { nameEn: "Extra Roasted Pine Nuts", nameAr: "صنوبر بلدي محمص إضافي", price: 1.75 },
        { nameEn: "Add Sliced Chili Green Peppers", nameAr: "فلفل حار مشوي", price: 0.50 }
      ]
    }
  },
  {
    id: "fukharet-lahmeh-bandora",
    nameEn: "Fukharet Lahmeh bil Bandora",
    nameAr: "فخارة لحمة بالبندورة البلدية",
    category: "fukharat_hot",
    price: 9.50,
    descriptionEn: "Tender cubes of local lamb simmered in sun-ripened Jordan Valley tomatoes, whole garlic cloves, olive oil, and hot green peppers baked to a blistered crust in earthenware.",
    descriptionAr: "قطع لحم بلدي طري مطهوة في فخارة مع طماطم غور الأردن الناضجة، ثوم كامل، فلفل حار، وزيت زيتون بكر معصور على البارد.",
    culturalStory: "A countryside staple celebrated by Jordanian farmers across the Jordan Valley, where tomatoes soak up the intense winter sun.",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=85",
    tags: ["halal", "gluten_free"],
    calories: 590,
    preparationTime: "15 min",
    allergens: [],
    pairingSuggestionEn: "Warm balloon bread straight from the oven.",
    pairingSuggestionAr: "خبز الطابون الساخن ومتبل باذنجان.",
    has3DPreview: true,
    modelType: "fukhara"
  },
  {
    id: "kibbeh-maqliyeh",
    nameEn: "Artisan Kibbeh Maqliyeh (4 pcs)",
    nameAr: "كبة مقلية بالصنوبر واللحم البلدي",
    category: "fukharat_hot",
    price: 6.25,
    descriptionEn: "Crispy handcrafted bulgur shells stuffed with seasoned minced lamb, sweet caramelized onions, toasted pine nuts, and sumac. Served golden with garlic mint dip.",
    descriptionAr: "أقراص كبة مقرمشة محشوة باللحم البلدي المفروم، البصل المكرمل، والصنوبر المحمص مع رشة سماق بلدي.",
    culturalStory: "A test of culinary mastery in every Levantine household, requiring a paper-thin exterior that yields a delicate crunch when bitten.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85",
    tags: ["halal", "contains_nuts"],
    calories: 460,
    preparationTime: "10-12 min",
    allergens: ["Gluten (Bulgur)", "Tree Nuts"],
    pairingSuggestionEn: "Mutabbal Bathenjan & fresh mint tea.",
    pairingSuggestionAr: "متبل باذنجان مشوي وشاي بالميرمية."
  },
  {
    id: "halloumi-meshwi",
    nameEn: "Charred Halloumi with Mountain Honey & Thyme",
    nameAr: "جبنة حلوم مشوية بالعسل البري والزعتر",
    category: "fukharat_hot",
    price: 5.50,
    descriptionEn: "Cast-iron seared Cypriot-Levantine goat & sheep halloumi cheese, drizzled with Ajloun mountain forest honey, toasted sesame, and fresh wild thyme leaves.",
    descriptionAr: "جبن حلوم بلدي مشوي على الجمر، مع عسل جبال عجلون البري، سمسم محمص، وأوراق الزعتر الأخضر الطازجة.",
    culturalStory: "Blends the ancient shepherd cheesemaking heritage of northern Jordan with wild herbs harvested from Ajloun's pine slopes.",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "gluten_free", "chef_choice"],
    calories: 420,
    preparationTime: "10 min",
    allergens: ["Dairy", "Sesame"],
    pairingSuggestionEn: "Fresh Pomegranate Juice or Sharab Al-Ward.",
    pairingSuggestionAr: "عصير رمان طازج أو شراب الورد."
  },

  // --- COLD MEZZE & SALADS ---
  {
    id: "hummus-sufra-special",
    nameEn: "Hummus Sufra with Warm Baladi Lamb & Pine Nuts",
    nameAr: "حمص سفرة الملكي باللحم البلدي والصنوبر",
    category: "cold_mezze",
    price: 6.00,
    descriptionEn: "Velvety smooth pureed chickpeas blended with premier Lebanese tahini and hand-pressed lemon, topped with sizzling minced lamb sautéed in clarified baladi butter and golden pine nuts.",
    descriptionAr: "حمص ناعم مخملي محضر يومياً بطحينية السمسم والليمون، مغطى باللحم البلدي الساخن المحوس بالسمن البلقاوي والصنوبر المقرمش.",
    culturalStory: "Sufra's chickpeas are soaked for 24 hours with baking soda and stone-ground to achieve an unmatched airy creaminess beloved by Amman's gourmands.",
    image: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "halal", "bestseller", "contains_nuts"],
    calories: 520,
    preparationTime: "5-8 min",
    allergens: ["Sesame", "Tree Nuts"],
    pairingSuggestionEn: "Puffy stone-oven bread straight from the open kitchen.",
    pairingSuggestionAr: "خبز الطابون الساخن الطازج."
  },
  {
    id: "hummus-classic",
    nameEn: "Hummus Baladi with Extra Virgin Olive Oil",
    nameAr: "حمص بلدي بزيت الزيتون العجلوني البكر",
    category: "cold_mezze",
    price: 4.25,
    descriptionEn: "Classic silky chickpea and sesame puree, crowned with whole spiced chickpeas, Aleppo paprika, fresh parsley, and cold-pressed olive oil from Ajloun groves.",
    descriptionAr: "حمص بطحينية السمسم الصافية مع زيت زيتون بكر عصرة أولى من كروم عجلون، وحبات حمص كاملة مع كمون وبابريكا.",
    culturalStory: "Ajloun's olive oil is considered the gold standard in Jordan, with century-old Roman olive trees producing peppery, aromatic oils.",
    image: "https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "halal", "gluten_free"],
    calories: 340,
    preparationTime: "5 min",
    allergens: ["Sesame"],
    pairingSuggestionEn: "Pickled wild cucumbers and olives.",
    pairingSuggestionAr: "مخللات بيتية وزيتون أردني مكبوس."
  },
  {
    id: "mutabbal-bathenjan",
    nameEn: "Smoked Mutabbal Bathenjan",
    nameAr: "متبل باذنجان مشوي على الفحم",
    category: "cold_mezze",
    price: 4.75,
    descriptionEn: "Charcoal-roasted eggplant whipped with sesame tahini, strained laban yogurt, crushed garlic, and lemon, garnished with ruby pomegranate jewels and olive oil.",
    descriptionAr: "باذنجان رومي مشوي على الحطب ومطحون بخشونة مع الطحينية واللبن الرائب والثوم المهروس، مزين بحبات الرمان وزيت الزيتون.",
    culturalStory: "The eggplant is roasted directly over open fruitwood embers to impart a distinctive wood-smoke fragrance.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "gluten_free", "halal"],
    calories: 280,
    preparationTime: "5 min",
    allergens: ["Sesame", "Dairy"],
    pairingSuggestionEn: "Mixed Grill and Shish Tawook.",
    pairingSuggestionAr: "مشاوي مشكلة وشيش طاووق."
  },
  {
    id: "tabbouleh-baladiyeh",
    nameEn: "Tabbouleh Baladiyeh with Heirloom Pomegranate",
    nameAr: "تبولة بلدية بالرمان والنعناع",
    category: "cold_mezze",
    price: 4.50,
    descriptionEn: "Finely hand-chopped flat-leaf parsley, vine tomatoes, sweet mint, green onions, and fine cracked bulgur wheat, dressed in vibrant freshly squeezed lemon and olive oil.",
    descriptionAr: "بقدونس طازج مفروم ناعماً بالسكين مع النعناع، طماطم مقطعة ناعم، برغل أسمر ناعم، ليمون طازج وزيت زيتون بكر وحبات رمان.",
    culturalStory: "True Levantine tabbouleh is overwhelmingly an herbed parsley salad, where the grain is merely a modest accent.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "halal", "bestseller"],
    calories: 210,
    preparationTime: "5-7 min",
    allergens: ["Gluten (Bulgur)"],
    pairingSuggestionEn: "Hot Kibbeh Maqliyeh and Kufta.",
    pairingSuggestionAr: "كبة مقلية وفخارة كفتة."
  },
  {
    id: "fattoush-sufra",
    nameEn: "Fattoush Sufra with Sumac Crisps",
    nameAr: "فتوش سفرة بدبس الرمان والخبز المقرمش",
    category: "cold_mezze",
    price: 4.50,
    descriptionEn: "Crispy garden purslane, romaine, radish, cucumbers, and tomatoes tossed in an artisanal dressing of wild sumac, pomegranate molasses, and golden pita crisp shards.",
    descriptionAr: "خضار موسمية طازجة من البقلة والخس والفجل والخيار، مغموسة بتتبيلة دبس الرمان الجبلي والسماق البلدي، مع رقائق الخبز المقرمش المحمص.",
    culturalStory: "A celebrated peasant salad originating from utilizing leftover bread baked the previous morning, revitalized with tart wild sumac.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "halal"],
    calories: 230,
    preparationTime: "5 min",
    allergens: ["Gluten"],
    pairingSuggestionEn: "Charcoal mixed grills.",
    pairingSuggestionAr: "مشاوي مشكلة على الفحم."
  },
  {
    id: "yalangi-vine-leaves",
    nameEn: "Yalangi Stuffed Vine Leaves with Olive Oil (6 pcs)",
    nameAr: "يالنجي ورق عنب بزيت الزيتون ودبس الرمان",
    category: "cold_mezze",
    price: 5.25,
    descriptionEn: "Delicate grape leaves hand-rolled with rice, chopped parsley, mint, tomatoes, and pomegranate reduction, simmered gently in olive oil and lemon broth.",
    descriptionAr: "ورق عنب بلدي ملفوف بعناية ومحشو بالأرز والخضار والأعشاب، مطهو على نار هادئة بزيت الزيتون ودبس الرمان وشرائح الليمون.",
    culturalStory: "Hand-rolled daily by Sufra's heritage chefs using seasonal leaves from the terraced vineyards of northern Jordan.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "gluten_free", "halal"],
    calories: 260,
    preparationTime: "5 min",
    allergens: [],
    pairingSuggestionEn: "Limonana with mint.",
    pairingSuggestionAr: "عصير ليمون ونعناع منعش."
  },

  // --- CHARCOAL GRILLS & SAJIYAT ---
  {
    id: "mashawi-sufra-royal",
    nameEn: "Mashawi Sufra Royal Mixed Charcoal Grill",
    nameAr: "مشاوي سفرة الملكية المشكلة على الفحم",
    category: "grills_sajiyat",
    price: 18.50,
    descriptionEn: "A grand platter of skewered meats grilled over natural oak wood coals: Kebab Halabi, succulent Shish Tawook marinated in garlic yogurt, spiced Kufta Kebab, and prime tender Lamb Chop. Served over spicy biwaz parsley bread with charred tomatoes and garlic toum.",
    descriptionAr: "تشكيلة فاخرة مشوية على جمر خشب السنديان: كباب حلبي، شيش طاووق منقوع باللبن والثوم، كفتة لحم بلدي، وريشة خروف طرية، تقدم فوق رغيف بيواز بالبصل والسماق مع ثومية وبندورة مشوية.",
    culturalStory: "Charcoal grilling is a celebratory cornerstone of Amman weekends. Sufra uses pure olive-tree charcoal which produces intense clean heat without petroleum scents.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "halal", "bestseller"],
    calories: 820,
    preparationTime: "18-22 min",
    allergens: ["Gluten (Bread)", "Dairy"],
    pairingSuggestionEn: "Cold Tamarind Jallab or Sharab Al-Ward.",
    pairingSuggestionAr: "جلاب التمر الهندي البارد أو شراب الورد.",
    has3DPreview: true,
    modelType: "grill",
    customizationOptions: {
      portionSizes: [
        { name: "Regular Platter (طبق عادي لشخص)", priceAdjustment: 0 },
        { name: "Grand Royal Platter (طبق كبير لشخصين)", priceAdjustment: 15.00 }
      ],
      extras: [
        { nameEn: "Extra Skewer of Shish Tawook", nameAr: "سيخ شيش طاووق إضافي", price: 4.50 },
        { nameEn: "Extra Skewer of Lamb Kebab", nameAr: "سيخ كباب خروف إضافي", price: 5.00 },
        { nameEn: "Side of Homemade Garlic Toum", nameAr: "صحن ثومية بيتية", price: 1.50 }
      ]
    }
  },
  {
    id: "sajiet-ghanam-baladi",
    nameEn: "Sajiet Ghanam Baladi (Sizzling Lamb Sajieh)",
    nameAr: "صاجية لحم غنم بلدي على نار الحطب",
    category: "grills_sajiyat",
    price: 15.00,
    descriptionEn: "Sizzling Bedouin concave cast-iron pan loaded with tender strips of local lamb, slivered onions, heirloom green peppers, garlic, and special Sajieh spices, brought crackling to your table with shrak bread.",
    descriptionAr: "صاجية بدوية أردنية أصيلة من لحم الخروف البلدي المفروم شرائح مع البصل والفلفل الأخضر الحار والثوم والبهارات البدوية، تقدم وهي تطشطش على الصاج الساخن.",
    culturalStory: "Born around desert campfires in Wadi Rum and Petra, where Bedouins flipped convex iron domes upside-down over roaring embers to stir-fry freshly butchered meats.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "halal", "bestseller"],
    calories: 740,
    preparationTime: "15 min",
    allergens: ["Gluten (Bread)"],
    pairingSuggestionEn: "Piping hot Shrak bread & fresh Rocca Salad.",
    pairingSuggestionAr: "خبز شراك ساخن وسلطة جرجير بالبصل والسماق.",
    has3DPreview: true,
    modelType: "grill"
  },
  {
    id: "shish-tawook-toum",
    nameEn: "Shish Tawook with Artisanal Garlic Toum",
    nameAr: "شيش طاووق مشوي مع ثومية سفرة البيتية",
    category: "grills_sajiyat",
    price: 13.50,
    descriptionEn: "Tender chicken skewers marinated for 24 hours in citrus, Greek yogurt, cardamom, and paprika, grilled to juicy char perfection. Accompanied by Sufra's famous whipped garlic toum and golden potato wedges.",
    descriptionAr: "شيش طاووق دجاج طري متبل لأربع وعشرين ساعة بالليمون واللبن والبهارات الخاصة، مشوي على الجمر، يقدم مع الثومية المخفوقة وبطاطا مقرمشة.",
    culturalStory: "Marinated with wild mountain oregano and fresh lemons, creating an ultra-juicy bite with a light char crust.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=85",
    tags: ["halal"],
    calories: 610,
    preparationTime: "15-18 min",
    allergens: ["Dairy"],
    pairingSuggestionEn: "Hummus Baladi and Fattoush.",
    pairingSuggestionAr: "حمص وسلطة فتوش."
  },
  {
    id: "lamb-chops-kastaleta",
    nameEn: "Char-Grilled Baladi Lamb Chops (Kastaleta)",
    nameAr: "ريش غنم بلدي مشوية على الجمر (كستليتة)",
    category: "grills_sajiyat",
    price: 17.50,
    descriptionEn: "Four premium baladi lamb rib chops, rubbed in rosemary, black pepper, and cold-pressed olive oil, seared over blazing oak charcoal to medium-tender perfection.",
    descriptionAr: "أربع قطع من ريش الخروف البلدي الممتاز، متبلة بإكليل الجبل وزيت الزيتون والفلفل الأسود، مشوية على الفحم لتظل طرية وغنية بالعصارة.",
    culturalStory: "Sourced exclusively from Jordan's southern pastures where livestock feeds on wild desert herbs like shih and za'atar, giving the meat a naturally sweet, aromatic flavor.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "halal", "gluten_free"],
    calories: 760,
    preparationTime: "18-20 min",
    allergens: [],
    pairingSuggestionEn: "Smoked Mutabbal and Grilled Vegetables.",
    pairingSuggestionAr: "متبل باذنجان وخضار مشوية."
  },

  // --- STONE OVEN BAKERY ---
  {
    id: "sufra-balloon-bread",
    nameEn: "Sufra Hot Stone Balloon Bread (Basket)",
    nameAr: "سلة خبز سفرة المنفوخ من بيت النار",
    category: "fresh_bakery",
    price: 1.50,
    descriptionEn: "Spectacular artisan puffy flatbread pulled blistering hot from our visible glass-walled stone oven every few minutes. Steam bursts with every tear.",
    descriptionAr: "خبز سفرة الشهير المنتفخ يُسحب ساخناً من فرن الحجر المكشوف كل بضع دقائق، يقدم طازجاً مع البخار والريحة الزكية.",
    culturalStory: "Baked at 400°C on natural lava stones, causing the trapped moisture to expand into a magnificent golden dome in under 60 seconds.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "halal", "bestseller"],
    calories: 180,
    preparationTime: "3 min",
    allergens: ["Gluten"],
    pairingSuggestionEn: "Essential accompaniment for all Mezze and Fukharat.",
    pairingSuggestionAr: "الرفيق الأساسي لجميع المقبلات والفخارات."
  },
  {
    id: "manousheh-zaatar",
    nameEn: "Wild Baladi Za'atar & Virgin Oil Manousheh",
    nameAr: "منقوشة زعتر بلدي أخضر بالزيت العجلوني",
    category: "fresh_bakery",
    price: 3.25,
    descriptionEn: "Stone-baked flatbread spread with an abundant blend of wild thyme from the hills of Salt, roasted sesame seeds, tart sumac, and rich green olive oil.",
    descriptionAr: "منقوشة مخبوزة على حجر الفرن بالزعتر الأخضر البري من جبال السلط، والسمسم المحمص، والسماق وزيت الزيتون البكر الفاخر.",
    culturalStory: "Wild za'atar has been foraged across Jordanian mountain trails since antiquity and forms the classic breakfast cornerstone of Levantine culture.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "halal"],
    calories: 310,
    preparationTime: "8 min",
    allergens: ["Gluten", "Sesame"],
    pairingSuggestionEn: "Fresh mint tea & Labneh with black olives.",
    pairingSuggestionAr: "شاي بالنعناع وصحن لبنة بلدية بالزيتون."
  },
  {
    id: "manousheh-jibneh",
    nameEn: "Akkawi & Nabulsi Triple Cheese Manousheh",
    nameAr: "منقوشة جبنة نابلسية وعكاوية بحبة البركة",
    category: "fresh_bakery",
    price: 4.25,
    descriptionEn: "Melted blend of traditional Nabulsi sheep cheese and Akkawi cheese, flecked with aromatic nigella seeds and fresh mint.",
    descriptionAr: "مزيج غني من الجبنة النابلسية والعكاوية البلدية المذابة فوق العجين الذهبي، مع رشة حبة البركة والنعناع الأخضر.",
    culturalStory: "Nabulsi cheese is soaked overnight to remove excess brine and spiced with mahlab and mastic for its unmistakable fragrance.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "halal"],
    calories: 390,
    preparationTime: "8 min",
    allergens: ["Gluten", "Dairy"],
    pairingSuggestionEn: "Tomato slices & fresh mint leaves.",
    pairingSuggestionAr: "شرائح طماطم ونعناع طازج."
  },

  // --- DESSERTS ---
  {
    id: "um-ali-royale",
    nameEn: "Um Ali Royale with Clotted Ashta & Pistachios",
    nameAr: "أم علي الملكية بالقشطة البلدية والفستق الحلبي",
    category: "desserts",
    price: 5.50,
    descriptionEn: "The legendary Middle Eastern warm dessert. Flaky baked puff pastry steeped in sweetened vanilla milk, cream, roasted Aleppo pistachios, almonds, and golden raisins, crowned with thick fresh clotted Ashta and broiled golden.",
    descriptionAr: "حلوى الشرق الدافئة الأكثر دلالاً. رقائق البف باستري الهشة المغمسة بالحليب الدافئ المحلى بالقشطة والمطيب بالفانيلا، والمحشوة بالفستق الحلبي واللوز، مغطاة بطبقة قشطة بلدية مكرملة تحت الشواية.",
    culturalStory: "A celebratory dessert originating from Cairo in the 13th century and refined in grand Levantine villas, serving as the ultimate warm comfort finale.",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "vegetarian", "bestseller", "contains_nuts"],
    calories: 520,
    preparationTime: "10 min",
    allergens: ["Dairy", "Gluten", "Tree Nuts"],
    pairingSuggestionEn: "Jordanian Cardamom Coffee (Qahwa Sada).",
    pairingSuggestionAr: "فنجان قهوة سادة أردنية بالهيل.",
    has3DPreview: true,
    modelType: "dessert"
  },
  {
    id: "osmalieh-ashta",
    nameEn: "Pistachio Osmalieh with Orange Blossom",
    nameAr: "عثملية مقرمشة بالقشطة الطازجة وماء الزهر",
    category: "desserts",
    price: 6.00,
    descriptionEn: "Two layers of golden, ultra-crispy vermicelli pastry cradling a heart of chilled artisan clotted Ashta cream, drizzled with orange blossom syrup and crushed emerald pistachios.",
    descriptionAr: "طبقتان من شعيرية العثملية المحمصة المقرمشة يتوسطهما قلب من القشطة البلدية الطازجة، تسقى بقطر ماء الزهر وتتوج بالفستق الحلبي الأخضر.",
    culturalStory: "Originating during the Ottoman era in Damascus and Amman, the contrast between the piping-hot crunchy noodles and cold fresh cream is sublime.",
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1200&q=85",
    tags: ["chef_choice", "vegetarian", "contains_nuts"],
    calories: 490,
    preparationTime: "8 min",
    allergens: ["Dairy", "Gluten", "Tree Nuts"],
    pairingSuggestionEn: "Fresh Mint Black Tea.",
    pairingSuggestionAr: "كوب شاي أسود بالنعناع أو الميرمية.",
    has3DPreview: true,
    modelType: "dessert"
  },
  {
    id: "knafeh-nabulsiyeh",
    nameEn: "Warm Knafeh Nabulsiyeh with Rose Syrup",
    nameAr: "كنافة نابلسية دافئة بالجبن المذّاب والقطر",
    category: "desserts",
    price: 5.50,
    descriptionEn: "Sufra's tribute to the world's most famous sweet. Sweet goat & sheep cheese melting under a glowing golden semolina crust, soaked in hot rose water syrup and crushed pistachios.",
    descriptionAr: "كنافة خشنة أو ناعمة بالجبن البلدي الذائب تحت طبقة ذهبية مقرمشة، تُسقى بالقطر الساخن وتزين بالفستق الحلبي الفاخر.",
    culturalStory: "Amman has a historic love affair with Knafeh, with downtown sweets masters perfecting this cheese dessert for over a century.",
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "bestseller", "contains_nuts"],
    calories: 540,
    preparationTime: "8 min",
    allergens: ["Dairy", "Gluten", "Tree Nuts"],
    pairingSuggestionEn: "Arabic Cardamom Coffee.",
    pairingSuggestionAr: "قهوة عربية بالهيل."
  },
  {
    id: "halawet-el-jibn",
    nameEn: "Halawet El Jibn Rolls with Rose Water (5 pcs)",
    nameAr: "حلاوة الجبن الحموية بالقشطة ومربى الورد",
    category: "desserts",
    price: 5.00,
    descriptionEn: "Silken sweet rolls of semolina and cheese dough stuffed with clotted cream, topped with candied rose petals, crushed pistachios, and light orange blossom nectar.",
    descriptionAr: "لفائف طرية من عجينة الجبن والسميد المطبوخ، محشوة بالقشطة البلدية ومزينة ببتلات الورد الجوري المعسل والفستق الحلبي.",
    culturalStory: "A delicate confectionery triumph requiring precise heat control to stretch the melted cheese dough into tissue-thin translucent sheets.",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "contains_nuts"],
    calories: 380,
    preparationTime: "5 min",
    allergens: ["Dairy", "Gluten", "Tree Nuts"],
    pairingSuggestionEn: "Hibiscus Iced Nectar.",
    pairingSuggestionAr: "كركديه بارد بالثلج."
  },

  // --- BEVERAGES & COFFEE ---
  {
    id: "limonana-sufra",
    nameEn: "Amman Signature Limonana",
    nameAr: "ليموناضة سفرة بالنعناع البلدي المنعش",
    category: "beverages",
    price: 3.50,
    descriptionEn: "Jordan's favorite cooling elixir. Freshly squeezed Mediterranean lemons blended frozen with garden-fresh spearmint, cane sugar syrup, and crushed ice.",
    descriptionAr: "المشروب الأكثر انتعاشاً في صيف عمّان. ليمون طبيعي طازج مخفوق مع أوراق النعناع الخضراء والثلج المجروش وسيروب قصب السكر.",
    culturalStory: "The indispensable thirst-quencher across Amman's sunny cafes and garden terraces.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "gluten_free", "halal", "bestseller"],
    calories: 140,
    preparationTime: "4 min",
    allergens: [],
    pairingSuggestionEn: "Perfect counterpoint to rich dishes like Mansaf and Mixed Grill.",
    pairingSuggestionAr: "مثالي مع المنسف والمشاوي."
  },
  {
    id: "sharab-al-ward",
    nameEn: "Sharab Al-Ward (Damascus Rose & Hibiscus)",
    nameAr: "شراب الورد الشامي مع الكركديه المنعش",
    category: "beverages",
    price: 3.75,
    descriptionEn: "Infusion of organic Damascus rose petals, wild hibiscus flowers, hint of lime, served over crystalline ice and garnished with edible rosebuds and pine nuts.",
    descriptionAr: "شراب فاخر من خلاصة بتلات الورد الجوري الشامي وزهر الكركديه مع لمسة ليمون وصنوبر نيّ مقرمش.",
    culturalStory: "Traditionally offered to honored guests upon entering Levantine mansions as a gesture of gracious welcome.",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "gluten_free", "halal", "chef_choice"],
    calories: 110,
    preparationTime: "4 min",
    allergens: ["Tree Nuts"],
    pairingSuggestionEn: "Cold Mezze and Halloumi.",
    pairingSuggestionAr: "المقبلات الباردة والجبن المشوي."
  },
  {
    id: "tamarind-jallab",
    nameEn: "Royal Jallab with Rose Water & Pine Nuts",
    nameAr: "جلاب التمر ودبس العنب مع الصنوبر",
    category: "beverages",
    price: 3.75,
    descriptionEn: "Traditional syrup crafted from carob, dates, grape molasses, and smoked incense water, served tall over shaved ice with swimming raw pine nuts and golden raisins.",
    descriptionAr: "مشروب التراث من دبس التمر والعنب وماء البخور، يقدم مثلجاً مع الصنوبر والزبيب الذهبي على الوجه.",
    culturalStory: "A deeply nostalgic drink celebrated during festive gatherings and Ramadan evenings across the Levant.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "gluten_free", "halal"],
    calories: 175,
    preparationTime: "4 min",
    allergens: ["Tree Nuts"],
    pairingSuggestionEn: "Mashawi and Sajieh.",
    pairingSuggestionAr: "المشاوي والصاجيات."
  },
  {
    id: "qahwa-sada-cardamom",
    nameEn: "Authentic Jordanian Qahwa Sada (Dallah Pot)",
    nameAr: "دلة قهوة سادة أردنية أصيلة بالهيل الأخضر",
    category: "beverages",
    price: 2.50,
    descriptionEn: "Ceremonial Bedouin-style dark roasted coffee brewed with cracked green cardamom pods and no sugar. Poured steaming from a traditional brass dallah pot.",
    descriptionAr: "قهوة عربية أصيلة محوجة بالهيل الأخضر الفاخر، تُصب ساخنة من الدلة النحاسية في فناجين التراث، بدون سكر وفق الأصول.",
    culturalStory: "The supreme symbol of Jordanian hospitality: 'A Dallah is never empty, and a guest is always honored.' Shaking the cup signals you are satisfied.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85",
    tags: ["vegetarian", "gluten_free", "halal", "bestseller"],
    calories: 5,
    preparationTime: "5 min",
    allergens: [],
    pairingSuggestionEn: "Essential with Um Ali, Knafeh, or right after Mansaf.",
    pairingSuggestionAr: "لا غنى عنها بعد المنسف ومع أم علي والكنافة."
  }
];

export const TABLES = [
  { id: "VIP-1", nameEn: "Table 1 - Jasmine Garden Terrace", nameAr: "طاولة ١ - شرفة حديقة الياسمين", type: "Outdoor Terrace" },
  { id: "VIP-2", nameEn: "Table 2 - Ottoman Heritage Salon", nameAr: "طاولة ٢ - صالون التراث العثماني", type: "Indoor Heritage" },
  { id: "VIP-3", nameEn: "Table 3 - Royal Balcony (Street View)", nameAr: "طاولة ٣ - الشرفة الملكية المطلة", type: "Balcony" },
  { id: "VIP-4", nameEn: "Table 4 - Stone Fountain Courtyard", nameAr: "طاولة ٤ - باحة النافورة الحجرية", type: "Courtyard" },
  { id: "Table-5", nameEn: "Table 5 - Olive Grove Alcove", nameAr: "طاولة ٥ - زاوية شجر الزيتون", type: "Garden" },
  { id: "Table-6", nameEn: "Table 6 - Stained Glass Hall", nameAr: "طاولة ٦ - قاعة الزجاج المعشق", type: "Indoor" },
  { id: "Table-7", nameEn: "Table 7 - Oven-Side Warm Table", nameAr: "طاولة ٧ - بجوار بيت النار والفرن", type: "Bakery View" },
  { id: "Table-8", nameEn: "Table 8 - Rainbow Street Promenade", nameAr: "طاولة ٨ - واجهة شارع الرينبو", type: "Streetfront" }
];
