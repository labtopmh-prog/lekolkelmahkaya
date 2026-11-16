import type { Book, Quote, TeamMember } from '../types/library';

export const LIBRARY_MEDIA = {
  exterior: '/src/assets/images/garden_library_exterior_1794831959336.jpg',
  interior: '/src/assets/images/library_interior_sanctuary_1794831960534.jpg',
  bookArt: '/src/assets/images/book_cover_art_1794831963359.jpg',
  malak: '/src/assets/images/team_malak_portrait_1794831960548.jpg',
  mustafa: '/src/assets/images/team_mustafa_portrait_1794831961752.jpg',
  mariam: '/src/assets/images/team_mariam_portrait_1794831961409.jpg',
  habiba: '/src/assets/images/team_habiba_clean_1794833283075.jpg',
  julia: '/src/assets/images/team_julia_portrait_1794831962551.jpg',
};

export const SEED_TEAM: TeamMember[] = [
  {
    id: 'malak-ahmed-sami',
    name: 'ملك أحمد سامي',
    roleTitle: 'مؤسسة المكتبة والمديرة الرئيسية',
    roleLevel: 'super_admin',
    bio: 'صاحبة الرؤية الأدبية لمنصة «كل كلمة حكاية»، تشرف على جودة المحتوى، وبناء الهوية الثقافية، وإدارة الصلاحيات العليا للمكتبة.',
    portraitUrl: LIBRARY_MEDIA.malak,
    accentTone: '#FBECEF',
    sortOrder: 1,
  },
  {
    id: 'mustafa-hawas',
    name: 'مصطفى حواس',
    roleTitle: 'المساعد الرئيسي',
    roleLevel: 'chief_assistant',
    bio: 'ينسّق سير العمل بين الأقسام، ويتابع تحديث فهارس الكتب ومراجعة الاقتباسات اليومية لضمان تجربة قراءة سلسة على الويب والهاتف.',
    portraitUrl: LIBRARY_MEDIA.mustafa,
    accentTone: '#EAF4FA',
    sortOrder: 2,
  },
  {
    id: 'mariam-tarek',
    name: 'مريم طارق',
    roleTitle: 'مساعدة',
    roleLevel: 'assistant',
    bio: 'تعتني بانتقاء الخواطر الرقيقة وقسم «كلمات تلمس القلب»، مع تنسيق النصوص الأدبية ومراجعة سلاسة الفصول.',
    portraitUrl: LIBRARY_MEDIA.mariam,
    accentTone: '#F2EEFA',
    sortOrder: 3,
  },
  {
    id: 'habiba-raouf',
    name: 'حبيبة رؤوف',
    roleTitle: 'مساعدة',
    roleLevel: 'assistant',
    bio: 'تشرف على تصنيف الكتب والأرشفة الموضوعية وإعداد قوائم القراءة الهادئة لتيسير وصول القارئ إلى حكايته المفضلة.',
    portraitUrl: LIBRARY_MEDIA.habiba,
    accentTone: '#EAF6F0',
    sortOrder: 4,
  },
  {
    id: 'julia-gad',
    name: 'جوليا جاد',
    roleTitle: 'مساعدة',
    roleLevel: 'assistant',
    bio: 'تتابع رسائل القرّاء واقتراحاتهم، وتشارك في اختيار «اقتباس اليوم» وتجارب التفاعل الصباحي اللطيف.',
    portraitUrl: LIBRARY_MEDIA.julia,
    accentTone: '#FDF0E6',
    sortOrder: 5,
  },
];

export const SEED_BOOKS: Book[] = [
  {
    id: 'morning-letters-to-the-soul',
    title: 'رسائل الصباح إلى الروح',
    author: 'ملك أحمد سامي',
    category: 'أدب وخواطر',
    synopsis:
      'نصوص صباحية رقيقة عن الهدوء الداخلي، وامتنان التفاصيل الصغيرة، وكيف تصبح الكلمة الدافئة مرفأً آمنًا في زحام الأيام.',
    coverColor: '#FBECEF',
    coverImage: LIBRARY_MEDIA.bookArt,
    readingMinutes: 14,
    featured: true,
    createdBy: 'seed',
    chapters: [
      {
        id: 'ch-1',
        title: 'الفصل الأول: حين يفتح الصباح نافذته',
        content:
          'في اللحظات الأولى من النهار، قبل أن تتزاحم الأصوات، ثمة مساحة بيضاء تشبه صفحة كتاب لم يُكتب بعد. هناك تتعلّم الروح أن تنصت لوقع الخطى الهادئة في الحديقة، وأن تمنح نفسها إذنًا بالبدء من جديد.\n\nليست كل الحكايات بحاجة إلى صخب لتصل إلى القلب؛ فبعض الكلمات تشبه قطرة ندى على ورقة ورد، صغيرة في حجمها، لكنها كافية لتمنح الصباح كله معنى متجددًا.',
      },
      {
        id: 'ch-2',
        title: 'الفصل الثاني: مرفأ الكلمات الصادقة',
        content:
          'نقرأ أحيانًا لا لنضيف معلومة جديدة إلى عقولنا، بل لنطمئن أن ثمة من شعر بما نشعر به تمامًا، وصاغ الحيرة في جملة أنيقة دافئة.\n\nكل مكتبة هي وعد صامت بالرفقة؛ تدخلها مثقلًا بالتساؤلات، وتخرج منها وقد اتسع في صدرك مكانٌ للسكينة والفهم.',
      },
      {
        id: 'ch-3',
        title: 'الفصل الثالث: ما تتركه الفصول فينا',
        content:
          'الأيام الجميلة لا تقاس بطولها، بل بعمق الأثر الذي تتركه الكلمة الطيبة في نفوس من نلقاهم. احتفظ دائمًا بدفتر صغير للامتنان، واكتب فيه جملة واحدة كل مساء تذكّرك بأن النور يسكن التفاصيل البسيطة.',
      },
    ],
  },
  {
    id: 'garden-of-unspoken-stories',
    title: 'حديقة الحكايات غير المروية',
    author: 'ياسمين المنصوري',
    category: 'حكايات ملهمة',
    synopsis:
      'مجموعة قصصية تدور داخل مكتبة قديمة تحيط بها أزهار اللافندر، حيث يكتشف كل زائر أن له حكاية تنتظره بين الرفوف.',
    coverColor: '#F2EEFA',
    coverImage: LIBRARY_MEDIA.exterior,
    readingMinutes: 18,
    featured: true,
    createdBy: 'seed',
    chapters: [
      {
        id: 'ch-1',
        title: 'الفصل الأول: الباب الخشبي ذو القوس الكريمي',
        content:
          'لم تكن اللافتة عند مدخل الحديقة كبيرة، لكنها كانت مكتوبة بخط يجمع بين الوقار واللطف: «كل كلمة حكاية». كان النسيم يحرّك سنابل اللافندر على جانبي الممر الحجري، كأنه يدعو العابرين إلى التمهّل قليلًا.\n\nداخل القاعة، كانت الشمس ترسم خيوطًا ذهبية على الطاولات الخشبية الفاتحة، فيما استقر كتاب مفتوح على المنصة الوسطى ينتظر من يقلب صفحته الأولى.',
      },
      {
        id: 'ch-2',
        title: 'الفصل الثاني: الأثر الذي لا يزول',
        content:
          'اكتشفت سلمى أن البطاقات المخبأة بين صفحات الكتب القديمة ليست مجرد تذكارات عابرة، بل رسائل تشجيع تركها قرّاء سبقوها: «ستمر هذه الغيمة، وستزهر أيامك كما تزهر هذه الحديقة في الربيع».',
      },
    ],
  },
  {
    id: 'mirrors-of-calm-light',
    title: 'مرايا الضوء الهادئ',
    author: 'عمر الشهابي',
    category: 'تنمية وبصيرة',
    synopsis:
      'تأملات عملية ولطيفة في ترتيب الأولويات الذهنية، وبناء عادات قراءة مستدامة تمنح العقل صفاءً وسط تسارع الحياة الرقمية.',
    coverColor: '#EAF4FA',
    coverImage: LIBRARY_MEDIA.interior,
    readingMinutes: 16,
    featured: false,
    createdBy: 'seed',
    chapters: [
      {
        id: 'ch-1',
        title: 'الفصل الأول: فضيلة التمهّل',
        content:
          'العقل المرهق لا يحتاج إلى المزيد من الإشعارات، بل إلى عشر دقائق من القراءة الهادئة بعيدًا عن الضجيج. حين تمنح الفكرة وقتها لتنضج، يتبدّل إيقاع يومك بأكمله.\n\nابدأ بصفحتين في الصباح وصفحتين قبل النوم؛ الاستمرار اللطيف أصدق أثرًا من الحماس المؤقت.',
      },
      {
        id: 'ch-2',
        title: 'الفصل الثاني: فن الانتقاء',
        content:
          'ما تقرؤه يشكّل لغتك الداخلية؛ فاختر لروحك نصوصًا تزيدها رقة ووضوحًا، وجالس الكتب التي تعلّمك كيف ترى الجمال في الأشياء المعتادة.',
      },
    ],
  },
  {
    id: 'the-tea-cup-novella',
    title: 'حكاية فنجان الشاي والنافذة',
    author: 'نور الهدى كمال',
    category: 'روايات قصيرة',
    synopsis:
      'رواية قصيرة دافئة عن كاتبة شابة تجتمع بأصدقائها في ركن قراءة مشمس، ليكتشفوا أن الصداقة الحقيقية تشبه كتابًا نعود إليه كل موسم.',
    coverColor: '#FDF0E6',
    coverImage: LIBRARY_MEDIA.bookArt,
    readingMinutes: 22,
    featured: true,
    createdBy: 'seed',
    chapters: [
      {
        id: 'ch-1',
        title: 'الفصل الأول: لقاء الجمعة',
        content:
          'على الطاولة القريبة من النافذة الشرقية، اجتمع خمسة أصدقاء يحمل كل منهم دفترًا ومشروبًا دافئًا. لم يكن هدفهم سوى مشاركة سطر واحد استوقفهم خلال الأسبوع.\n\nأدركوا مع مرور الأسابيع أن تلك الجلسات القصيرة تحوّلت إلى واحة أمان حقيقية في مدينة لا تتوقف عن الركض.',
      },
      {
        id: 'ch-2',
        title: 'الفصل الثاني: أوراق الخريف المزهرة',
        content:
          'حين جاءت لحظة التحدي، لم يقف أحدهم وحيدًا؛ كانت الكلمات التي تبادلوها في أوقات الهدوء هي الجسر الذي عبروا به نحو بداية أكثر نضجًا وإشراقًا.',
      },
    ],
  },
  {
    id: 'whispers-of-jasmine-ink',
    title: 'همس الحبر والياسمين',
    author: 'ليلى عبد العزيز',
    category: 'شعر ونثر',
    synopsis:
      'مقطوعات نثرية وشعرية رقيقة تحتفي بجمال اللغة العربية، وإيقاعها الموسيقي القادر على مداواة الروح وإلهام الخيال.',
    coverColor: '#EAF6F0',
    coverImage: LIBRARY_MEDIA.exterior,
    readingMinutes: 11,
    featured: false,
    createdBy: 'seed',
    chapters: [
      {
        id: 'ch-1',
        title: 'المقطوعة الأولى: أبجدية النور',
        content:
          'في البدء كانت الكلمة جسرًا بين قلبين، ونافذة تطل على بساتين لا يذبل ربيعها.\nكل حرف يُكتب بمحبة يضيء في ذاكرة القارئ قنديلًا لا ينطفئ.',
      },
      {
        id: 'ch-2',
        title: 'المقطوعة الثانية: سكون المساء',
        content:
          'اترك للنوافذ حقها من نسيم الغروب، وللقلب حقه في الطمأنينة؛ فغدًا تكتب الشمس سطرًا جديدًا على جبين السماء.',
      },
    ],
  },
  {
    id: 'notes-on-gentle-courage',
    title: 'دفتر الشجاعة اللطيفة',
    author: 'طارق الزيني',
    category: 'تنمية وبصيرة',
    synopsis:
      'دليل أدبي وإنساني يبرهن أن اللطف والهدوء ليسا ضعفًا، بل هما أرقى أشكال القوة والثبات في القيادة والحياة.',
    coverColor: '#F5EFE6',
    coverImage: LIBRARY_MEDIA.interior,
    readingMinutes: 15,
    featured: false,
    createdBy: 'seed',
    chapters: [
      {
        id: 'ch-1',
        title: 'الفصل الأول: قوة النبرة الهادئة',
        content:
          'من يملك وضوح الفكرة لا يحتاج إلى رفع صوته. الكلمات المتزنة تصل أعمق، وتبني ثقة تدوم طويلًا بين الناس.',
      },
      {
        id: 'ch-2',
        title: 'الفصل الثاني: خطوات ثابتة في النور',
        content:
          'لا تنتظر الكمال كي تبدأ مشروعك أو تشارك حكايتك؛ كل أثر عظيم بدأ بصفحة واحدة كُتبت بإخلاص.',
      },
    ],
  },
];

export const SEED_QUOTES: Quote[] = [
  {
    id: 'q-daily-1',
    text: 'كل كلمة تُكتب بصدقٍ هي بذرة نورٍ؛ قد تمنح قلبًا غريبًا سببًا ليبتسم ويواصل الطريق.',
    author: 'ملك أحمد سامي',
    sourceTitle: 'رسائل الصباح إلى الروح',
    category: 'اقتباس اليوم',
    mood: 'إلهام ودفء',
    isDailyHighlight: true,
    createdBy: 'seed',
  },
  {
    id: 'q-daily-2',
    text: 'في المكتبات، لا نشعر بالوحدة أبدًا؛ فبين كل دفتي كتابٍ رفيقٌ ينصت إلينا بصمتٍ محبّ.',
    author: 'ياسمين المنصوري',
    sourceTitle: 'حديقة الحكايات غير المروية',
    category: 'اقتباس اليوم',
    mood: 'أنس وطمأنينة',
    isDailyHighlight: true,
    createdBy: 'seed',
  },
  {
    id: 'q-heart-1',
    text: 'ربما لا نملك تغيير الأمس، لكننا نملك دائمًا أن نكتب اليوم جملة أجمل وأكثر رحمة بأنفسنا.',
    author: 'مريم طارق',
    sourceTitle: 'مختارات كلمات تلمس القلب',
    category: 'كلمات تلمس القلب',
    mood: 'جبر خاطر',
    isDailyHighlight: false,
    createdBy: 'seed',
  },
  {
    id: 'q-heart-2',
    text: 'الأرواح الرقيقة تشبه الورق الكريمي؛ تحفظ أثر اللطف طويلًا، وتردّه عطرًا في كل موسم.',
    author: 'ليلى عبد العزيز',
    sourceTitle: 'همس الحبر والياسمين',
    category: 'كلمات تلمس القلب',
    mood: 'رقة وامتنان',
    isDailyHighlight: false,
    createdBy: 'seed',
  },
  {
    id: 'q-heart-3',
    text: 'لا تستهن بعشر دقائق تقضيها مع كتابٍ تحبه؛ إنها الاستراحة التي تستعيد فيها روحك اتزانها.',
    author: 'عمر الشهابي',
    sourceTitle: 'مرايا الضوء الهادئ',
    category: 'كلمات تلمس القلب',
    mood: 'سكينة',
    isDailyHighlight: false,
    createdBy: 'seed',
  },
  {
    id: 'q-heart-4',
    text: 'أجمل ما قد تهديه لإنسان هو كلمة تجعله يرى النور الذي نسي وجوده في داخله.',
    author: 'جوليا جاد',
    sourceTitle: 'رسائل القرّاء',
    category: 'كلمات تلمس القلب',
    mood: 'محبة وتشجيع',
    isDailyHighlight: false,
    createdBy: 'seed',
  },
  {
    id: 'q-wisdom-1',
    text: 'القراءة ليست هروبًا من الواقع، بل عودةٌ إليه بعينٍ أكثر رحابةً وقلبٍ أكثر حكمة.',
    author: 'طارق الزيني',
    sourceTitle: 'دفتر الشجاعة اللطيفة',
    category: 'حكم وأقوال',
    mood: 'بصيرة',
    isDailyHighlight: true,
    createdBy: 'seed',
  },
  {
    id: 'q-wisdom-2',
    text: 'الهدوء الحقيقي لا يعني غياب التحديات، بل حضور السكينة وسطها.',
    author: 'مصطفى حواس',
    sourceTitle: 'تأملات إدارية وأدبية',
    category: 'حكم وأقوال',
    mood: 'اتزان',
    isDailyHighlight: false,
    createdBy: 'seed',
  },
  {
    id: 'q-reflection-1',
    text: 'تتغير الفصول من حولنا لتذكّرنا أن لكل مرحلةٍ جمالها، ولكل صبرٍ أزهاره التي ستتفتح في وقتها.',
    author: 'حبيبة رؤوف',
    sourceTitle: 'قراءات موسمية',
    category: 'تأملات هادئة',
    mood: 'أمل وصبر',
    isDailyHighlight: false,
    createdBy: 'seed',
  },
  {
    id: 'q-reflection-2',
    text: 'حين تمشي في حديقة الكتب بقلبٍ متمهّل، تصبح أبسط العبارات قصيدة كاملة.',
    author: 'نور الهدى كمال',
    sourceTitle: 'حكاية فنجان الشاي والنافذة',
    category: 'تأملات هادئة',
    mood: 'تأمل',
    isDailyHighlight: true,
    createdBy: 'seed',
  },
];
