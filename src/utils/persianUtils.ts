// Persian character normalization & helper algorithms

export function normalizePersianChar(char: string): string {
  if (!char) return '';
  // Arabic Yeh to Persian Yeh
  if (char === '\u064A' || char === '\u0649') return 'ی';
  // Arabic Kaf to Persian Kaf
  if (char === '\u0643') return 'ک';
  // Standardize spaces and ZWNJ
  if (char === '\u200C') return '‌'; // Persian zero-width non-joiner
  if (char === '\u00A0') return ' '; // Non-breaking space to regular space
  return char;
}

export function normalizePersianText(text: string): string {
  return text
    .replace(/[\u064A\u0649]/g, 'ی')
    .replace(/[\u0643]/g, 'ک')
    .replace(/\u00A0/g, ' ')
    .trim();
}

// Convert English digits to Persian digits (123 -> ۱۲۳)
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

// Format seconds into MM:SS in Persian
export function formatTimeFa(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const str = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return toPersianDigits(str);
}

// Calculate typing metrics
export function calculateTypingMetrics(
  correctChars: number,
  incorrectChars: number,
  elapsedSeconds: number
) {
  const totalChars = correctChars + incorrectChars;
  const elapsedMinutes = Math.max(elapsedSeconds / 60, 0.001); // avoid div zero
  
  // Standard 5 chars = 1 word
  const wordsTyped = correctChars / 5;
  const wpm = Math.round(wordsTyped / elapsedMinutes);
  const rawWpm = Math.round((totalChars / 5) / elapsedMinutes);
  const cpm = Math.round(correctChars / elapsedMinutes);
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

  return {
    wpm: Math.max(0, wpm),
    rawWpm: Math.max(0, rawWpm),
    cpm: Math.max(0, cpm),
    accuracy: Math.min(100, Math.max(0, accuracy)),
    totalChars,
  };
}

// Persian vocabulary dictionary indexed by letters for smart drill generation
const PERSIAN_WORDS_BY_KEY: Record<string, string[]> = {
  'ب': ['بهار', 'باغ', 'برگ', 'بلند', 'باران', 'بزرگ', 'بهترین', 'بیدار'],
  'ت': ['تابستان', 'تلاش', 'تندرستی', 'توانایی', 'تاریخ', 'تصویر', 'تحقیق', 'تجربه'],
  'ن': ['نور', 'نگاه', 'نسیم', 'نشان', 'نامدار', 'نیایش', 'نرم‌افزار', 'نیکو'],
  'م': ['مهر', 'موفقیت', 'مهارت', 'معرفت', 'مسیر', 'ماه', 'میهن', 'مستمر'],
  'ک': ['کتاب', 'کوشش', 'کلمه', 'کوچک', 'کامل', 'کاروان', 'کاشانه', 'کهکشان'],
  'گ': ['گلستان', 'گوهر', 'گیاه', 'گرم', 'گذرگاه', 'گفتار', 'گرامی', 'گسترش'],
  'ش': ['شکوفه', 'شادی', 'شناخت', 'شیرین', 'شایسته', 'شبنم', 'شهریار', 'شوق'],
  'س': ['سرسبز', 'سلامت', 'ستاره', 'سپاس', 'سخن', 'سعادت', 'سرعت', 'سکوت'],
  'ی': ['یادگار', 'یاری', 'یکتا', 'یاس', 'یاقوت', 'یوز', 'یقین', 'یزدان'],
  'ل': ['لاله', 'لبخند', 'لطافت', 'لحظه', 'لذت', 'روشن', 'دلیر', 'بلبل'],
  'ا': ['امید', 'ایمان', 'اندیشه', 'آسمان', 'آرامش', 'آزادی', 'آفتاب', 'آموختن'],
  'ف': ['فرهنگ', 'فرزانگی', 'فردا', 'فروغ', 'فداکاری', 'فهم', 'فضیلت', 'فواره'],
  'غ': ['غروب', 'غیرت', 'غزل', 'غنچه', 'غمخوار', 'غنا', 'غار', 'غواص'],
  'ق': ['قلم', 'قدرت', 'قله', 'قرآن', 'قهرمان', 'قانون', 'قلب', 'قدیم'],
  'ع': ['عشق', 'عقل', 'علم', 'عزت', 'عدالت', 'عالم', 'عاطفه', 'عمیق'],
  'ه': ['هوش', 'همت', 'هنر', 'هستی', 'همدلی', 'هدف', 'همراه', 'هدایت'],
  'خ': ['خرد', 'خورشید', 'خنده', 'خاطره', 'خوشبختی', 'خلوت', 'خلاقیت', 'خواهش'],
  'ح': ['حکمت', 'حقیقت', 'حرکت', 'حس', 'حیات', 'حافظ', 'حرمت', 'حضور'],
  'ج': ['جهان', 'جوان', 'جذاب', 'جانبخش', 'جوشش', 'جامع', 'جنگل', 'جلوه'],
  'چ': ['چشمه', 'چراغ', 'چابک', 'چهره', 'چشم‌انداز', 'چکاوک', 'چمن', 'چاره'],
  'پ': ['پیروزی', 'پرتو', 'پرواز', 'پیمان', 'پشتکار', 'پژوهش', 'پاکیزه', 'پایدار'],
  'ض': ['ضمیر', 'ضیافت', 'ضرورت', 'ضمن', 'ضمانت', 'رضایت', 'روشن', 'حضور'],
  'ص': ['صداقت', 'صبوری', 'صفا', 'صمیمیت', 'صبحگاه', 'صلابت', 'صحیح', 'صدا'],
  'ث': ['ثروت', 'ثابت', 'ثمر', 'ثنا', 'مثل', 'اثر', 'مثلث', 'میراث'],
  'ر': ['روشنایی', 'رشد', 'راز', 'رهایی', 'روان', 'رنگین', 'راستی', 'رعنا'],
  'ز': ['زندگی', 'زیبایی', 'زرین', 'زلال', 'زمرد', 'زمان', 'زنده', 'زبان'],
  'د': ['دانش', 'درخشان', 'دوستی', 'دریا', 'دلاور', 'دلپذیر', 'دیار', 'دقت'],
  'ذ': ['ذوق', 'ذکر', 'ذره', 'ذهن', 'ذخیره', 'گذشته', 'لذت', 'جاذبه'],
  'ظ': ['ظرافت', 'ظهور', 'ظفر', 'منظره', 'حفظ', 'نظم', 'انتظار', 'عظیم'],
  'ط': ['طراوت', 'طلوع', 'طبیعت', 'طنین', 'طالب', 'طیور', 'طوفان', 'خاطر'],
  'و': ['وفاداری', 'وجدان', 'وسعت', 'والا', 'وقار', 'وحدت', 'وزین', 'وجود'],
  '‌': ['می‌شود', 'می‌رود', 'خانه‌ها', 'کتاب‌ها', 'دل‌پذیر', 'بی‌نهایت', 'می‌دانم', 'پیش‌رو'],
};

// Smart Error Diagnostic Engine
export interface ErrorAnalysis {
  weakestKeys: { char: string; errorCount: number; errorRate: number }[];
  diagnosisTitle: string;
  diagnosisPoints: string[];
  suggestedFocus: string;
  handFatigueRatio: { leftHandErrors: number; rightHandErrors: number };
}

export function analyzeTypingErrors(
  errorMap: Record<string, number>,
  totalKeyHits: number
): ErrorAnalysis {
  const entries = Object.entries(errorMap)
    .filter(([char]) => char.trim().length > 0 || char === '‌')
    .sort((a, b) => b[1] - a[1]);

  const weakestKeys = entries.slice(0, 5).map(([char, errorCount]) => ({
    char: char === '‌' ? 'نیم‌فاصله' : char,
    errorCount,
    errorRate: totalKeyHits > 0 ? Math.round((errorCount / totalKeyHits) * 100) : 0,
  }));

  const diagnosisPoints: string[] = [];
  let diagnosisTitle = 'وضعیت تایپ شما مطلوب است';
  let suggestedFocus = 'به تمرین روی حفظ ریتم یکنواخت ادامه دهید.';

  // Check top row vs home row vs bottom row error distribution
  const homeRowKeys = ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'];
  const topRowKeys = ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ', 'پ'];
  const bottomRowKeys = ['ظ', 'ط', 'ز', 'ر', 'ذ', 'د', 'و'];
  const leftHandKeys = ['ش', 'س', 'ی', 'ب', 'ل', 'ض', 'ص', 'ث', 'ق', 'ف', 'ظ', 'ط', 'ز', 'ر', 'ذ'];
  const rightHandKeys = ['ا', 'ت', 'ن', 'م', 'ک', 'گ', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ', 'پ', 'د', 'و'];

  let leftErrors = 0;
  let rightErrors = 0;
  let topErrors = 0;
  let bottomErrors = 0;

  Object.entries(errorMap).forEach(([char, count]) => {
    if (leftHandKeys.includes(char)) leftErrors += count;
    if (rightHandKeys.includes(char)) rightErrors += count;
    if (topRowKeys.includes(char)) topErrors += count;
    if (bottomRowKeys.includes(char)) bottomErrors += count;
  });

  if (entries.length > 0) {
    diagnosisTitle = `شناسایی نقاط خطای رایج: ${weakestKeys.map(k => k.char).join('، ')}`;

    if (errorMap['‌'] && errorMap['‌'] >= 2) {
      diagnosisPoints.push('فراموشی یا خطا در کلید نیم‌فاصله (Shift + Space). روی تایپ کلمات مرکب و افعال با پیشوند «می» تمرکز کنید.');
    }

    if (topErrors > bottomErrors * 1.5 && topErrors > 5) {
      diagnosisPoints.push('خطاهای مکرر در ردیف بالایی کیبورد نشان‌دهنده نیاز به تثبیت بازگشت انگشتان به ردیف پایگاه است.');
    }

    if (bottomErrors > topErrors * 1.5 && bottomErrors > 5) {
      diagnosisPoints.push('کشش انگشتان به ردیف پایین نیاز به تقویت هماهنگی عضلانی دارد (به‌ویژه حروف ر، ز، د).');
    }

    if (leftErrors > rightErrors * 1.8 && leftErrors > 4) {
      diagnosisPoints.push('دست چپ شما نسبت به دست راست خطای بیشتری ثبت کرده است (به‌ویژه انگشتان کوچک و حلقه چپ).');
      suggestedFocus = 'تمرین بیشتر روی حروف ش، س، ض، ص با دست چپ';
    } else if (rightErrors > leftErrors * 1.8 && rightErrors > 4) {
      diagnosisPoints.push('دست راست شما نیاز به تمرکز بیشتری در کلیدهای کناری (ک، گ، خ، ح) دارد.');
      suggestedFocus = 'تمرین روی کلیدهای انتهایی دست راست (ک، گ، چ، ج)';
    }

    if (diagnosisPoints.length === 0) {
      diagnosisPoints.push(`بیشترین خطا در حروف «${weakestKeys.slice(0, 3).map(k => k.char).join('» و «')}» رخ داده است.`);
      suggestedFocus = `تمرین هدفمند با کلیدهای ${weakestKeys.slice(0, 3).map(k => k.char).join('، ')}`;
    }
  } else {
    diagnosisPoints.push('دقت تایپ شما در این تمرین عالی بود و خطای شاخصی ثبت نشد!');
  }

  return {
    weakestKeys,
    diagnosisTitle,
    diagnosisPoints,
    suggestedFocus,
    handFatigueRatio: { leftHandErrors: leftErrors, rightHandErrors: rightErrors },
  };
}

// Generates a tailored remedial practice drill targeting user's weakest keys
export function generateSmartRemedialDrill(weakKeys: string[]): string {
  if (!weakKeys || weakKeys.length === 0) {
    return 'تمرین مستمر کلید اصلی موفقیت در تایپ ده انگشتی است. با آرامش و حفظ ریتم تایپ کنید تا سرعت شما به شکل پایدار رشد کند.';
  }

  const selectedWords: string[] = [];

  // Filter valid letters
  const cleanKeys = weakKeys
    .map(k => k === 'نیم‌فاصله' ? '‌' : k)
    .filter(k => PERSIAN_WORDS_BY_KEY[k]);

  if (cleanKeys.length === 0) {
    cleanKeys.push('ب', 'ت', 'ن', 'م', 'ک', 'س');
  }

  // Pick 2-3 words per weak key
  cleanKeys.forEach(key => {
    const list = PERSIAN_WORDS_BY_KEY[key] || [];
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    selectedWords.push(...shuffled.slice(0, 3));
  });

  // Add rhythm connectives
  const fillers = ['و', 'در', 'با', 'برای', 'که', 'این'];
  const drillItems: string[] = [];

  for (let i = 0; i < selectedWords.length; i++) {
    drillItems.push(selectedWords[i]);
    if (i % 3 === 2 && i < selectedWords.length - 1) {
      drillItems.push(fillers[Math.floor(Math.random() * fillers.length)]);
    }
  }

  return drillItems.join(' ');
}
