import { FingerType, KeyDefinition, KeyboardLayoutType } from '../types';

export const FINGER_COLORS: Record<FingerType, {
  bg: string;
  text: string;
  border: string;
  accent: string;
  labelFa: string;
  handFa: string;
}> = {
  'left-pinky': {
    bg: 'bg-rose-500/20',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
    accent: '#f43f5e',
    labelFa: 'انگشت کوچک',
    handFa: 'دست چپ',
  },
  'left-ring': {
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    accent: '#f59e0b',
    labelFa: 'انگشت حلقه',
    handFa: 'دست چپ',
  },
  'left-middle': {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    accent: '#10b981',
    labelFa: 'انگشت میانی',
    handFa: 'دست چپ',
  },
  'left-index': {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-300',
    border: 'border-cyan-500/40',
    accent: '#06b6d4',
    labelFa: 'انگشت اشاره',
    handFa: 'دست چپ',
  },
  'thumbs': {
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
    accent: '#a855f7',
    labelFa: 'انگشت شست',
    handFa: 'هر دو دست',
  },
  'right-index': {
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-300',
    border: 'border-indigo-500/40',
    accent: '#6366f1',
    labelFa: 'انگشت اشاره',
    handFa: 'دست راست',
  },
  'right-middle': {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    accent: '#10b981',
    labelFa: 'انگشت میانی',
    handFa: 'دست راست',
  },
  'right-ring': {
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    accent: '#f59e0b',
    labelFa: 'انگشت حلقه',
    handFa: 'دست راست',
  },
  'right-pinky': {
    bg: 'bg-rose-500/20',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
    accent: '#f43f5e',
    labelFa: 'انگشت کوچک',
    handFa: 'دست راست',
  },
};

// Generates 4 rows of keys customized to the user's specific Persian keyboard layout
export function getKeyboardRows(layout: KeyboardLayoutType | string = 'universal'): KeyDefinition[][] {
  const isWindows = layout === 'windows' || layout === 'universal';

  const row0: KeyDefinition[] = [
    { code: 'Backquote', faChar: '‌', faShiftChar: '÷', enChar: '`', finger: 'left-pinky' },
    { code: 'Digit1', faChar: '۱', faShiftChar: '!', enChar: '1', finger: 'left-pinky' },
    { code: 'Digit2', faChar: '۲', faShiftChar: '٫', enChar: '2', finger: 'left-ring' },
    { code: 'Digit3', faChar: '۳', faShiftChar: '٬', enChar: '3', finger: 'left-middle' },
    { code: 'Digit4', faChar: '۴', faShiftChar: '﷼', enChar: '4', finger: 'left-index' },
    { code: 'Digit5', faChar: '۵', faShiftChar: '٪', enChar: '5', finger: 'left-index' },
    { code: 'Digit6', faChar: '۶', faShiftChar: '×', enChar: '6', finger: 'right-index' },
    { code: 'Digit7', faChar: '۷', faShiftChar: '،', enChar: '7', finger: 'right-index' },
    { code: 'Digit8', faChar: '۸', faShiftChar: '*', enChar: '8', finger: 'right-middle' },
    { code: 'Digit9', faChar: '۹', faShiftChar: ')', enChar: '9', finger: 'right-ring' },
    { code: 'Digit0', faChar: '۰', faShiftChar: '(', enChar: '0', finger: 'right-pinky' },
    { code: 'Minus', faChar: '-', faShiftChar: '_', enChar: '-', finger: 'right-pinky' },
    { code: 'Equal', faChar: '=', faShiftChar: '+', enChar: '=', finger: 'right-pinky' },
    { code: 'Backspace', faChar: '⌫ پاک‌کردن', enChar: 'Backspace', finger: 'right-pinky', width: 'w-20 sm:w-24', isSpecial: true },
  ];

  const row1: KeyDefinition[] = [
    { code: 'Tab', faChar: 'Tab', enChar: 'Tab', finger: 'left-pinky', width: 'w-14 sm:w-16', isSpecial: true },
    { code: 'KeyQ', faChar: 'ض', faShiftChar: 'ْ', enChar: 'q', finger: 'left-pinky' },
    { code: 'KeyW', faChar: 'ص', faShiftChar: 'ٌ', enChar: 'w', finger: 'left-ring' },
    { code: 'KeyE', faChar: 'ث', faShiftChar: 'ٍ', enChar: 'e', finger: 'left-middle' },
    { code: 'KeyR', faChar: 'ق', faShiftChar: 'ً', enChar: 'r', finger: 'left-index' },
    { code: 'KeyT', faChar: 'ف', faShiftChar: 'ُ', enChar: 't', finger: 'left-index' },
    { code: 'KeyY', faChar: 'غ', faShiftChar: 'ِ', enChar: 'y', finger: 'right-index' },
    { code: 'KeyU', faChar: 'ع', faShiftChar: 'َ', enChar: 'u', finger: 'right-index' },
    { code: 'KeyI', faChar: 'ه', faShiftChar: 'ّ', enChar: 'i', finger: 'right-middle' },
    { code: 'KeyO', faChar: 'خ', faShiftChar: ']', enChar: 'o', finger: 'right-ring' },
    { code: 'KeyP', faChar: 'ح', faShiftChar: '[', enChar: 'p', finger: 'right-pinky' },
    { code: 'BracketLeft', faChar: 'ج', faShiftChar: '}', enChar: '[', finger: 'right-pinky' },
    { code: 'BracketRight', faChar: 'چ', faShiftChar: '{', enChar: ']', finger: 'right-pinky' },
    { 
      code: 'Backslash', 
      faChar: isWindows ? 'ژ' : 'پ', 
      faShiftChar: isWindows ? '|' : '|', 
      enChar: '\\', 
      finger: 'right-pinky', 
      width: 'w-12 sm:w-14' 
    },
  ];

  const row2: KeyDefinition[] = [
    { code: 'CapsLock', faChar: 'قفل', enChar: 'Caps', finger: 'left-pinky', width: 'w-16 sm:w-20', isSpecial: true },
    { code: 'KeyA', faChar: 'ش', faShiftChar: 'ؤ', enChar: 'a', finger: 'left-pinky' },
    { code: 'KeyS', faChar: 'س', faShiftChar: 'ئ', enChar: 's', finger: 'left-ring' },
    { code: 'KeyD', faChar: 'ی', faShiftChar: 'ي', enChar: 'd', finger: 'left-middle' },
    { code: 'KeyF', faChar: 'ب', faShiftChar: 'إ', enChar: 'f', finger: 'left-index' }, // Home bump
    { code: 'KeyG', faChar: 'ل', faShiftChar: 'أ', enChar: 'g', finger: 'left-index' },
    { code: 'KeyH', faChar: 'ا', faShiftChar: 'آ', enChar: 'h', finger: 'right-index' },
    { code: 'KeyJ', faChar: 'ت', faShiftChar: 'ة', enChar: 'j', finger: 'right-index' }, // Home bump
    { code: 'KeyK', faChar: 'ن', faShiftChar: '»', enChar: 'k', finger: 'right-middle' },
    { code: 'KeyL', faChar: 'م', faShiftChar: '«', enChar: 'l', finger: 'right-ring' },
    { code: 'Semicolon', faChar: 'ک', faShiftChar: ':', enChar: ';', finger: 'right-pinky' },
    { code: 'Quote', faChar: 'گ', faShiftChar: '"', enChar: "'", finger: 'right-pinky' },
    { code: 'Enter', faChar: '⏎ اینتر', enChar: 'Enter', finger: 'right-pinky', width: 'w-20 sm:w-24', isSpecial: true },
  ];

  const row3: KeyDefinition[] = [
    { code: 'ShiftLeft', faChar: 'تبدیل ⇧', enChar: 'Shift', finger: 'left-pinky', width: 'w-20 sm:w-24', isSpecial: true },
    { code: 'KeyZ', faChar: 'ظ', faShiftChar: 'ك', enChar: 'z', finger: 'left-pinky' },
    { code: 'KeyX', faChar: 'ط', faShiftChar: 'ٓ', enChar: 'x', finger: 'left-ring' },
    { code: 'KeyC', faChar: 'ز', faShiftChar: 'ژ', enChar: 'c', finger: 'left-middle' },
    { code: 'KeyV', faChar: 'ر', faShiftChar: 'ٰ', enChar: 'v', finger: 'left-index' },
    { code: 'KeyB', faChar: 'ذ', faShiftChar: '‌', enChar: 'b', finger: 'left-index' },
    { code: 'KeyN', faChar: 'د', faShiftChar: 'ٔ', enChar: 'n', finger: 'right-index' },
    { 
      code: 'KeyM', 
      faChar: isWindows ? 'پ' : 'ء', 
      faShiftChar: isWindows ? 'ء' : 'ئ', 
      enChar: 'm', 
      finger: 'right-index' 
    },
    { code: 'Comma', faChar: 'و', faShiftChar: '>', enChar: ',', finger: 'right-middle' },
    { code: 'Period', faChar: '.', faShiftChar: '<', enChar: '.', finger: 'right-ring' },
    { code: 'Slash', faChar: '/', faShiftChar: '؟', enChar: '/', finger: 'right-pinky' },
    { code: 'ShiftRight', faChar: '⇧ تبدیل', enChar: 'Shift', finger: 'right-pinky', width: 'w-24 sm:w-28', isSpecial: true },
  ];

  const row4: KeyDefinition[] = [
    { code: 'ControlLeft', faChar: 'Ctrl', enChar: 'Ctrl', finger: 'left-pinky', width: 'w-14 sm:w-16', isSpecial: true },
    { code: 'AltLeft', faChar: 'Alt', enChar: 'Alt', finger: 'left-pinky', width: 'w-12 sm:w-14', isSpecial: true },
    { code: 'Space', faChar: 'فاصله (Space)', faShiftChar: '‌ (نیم‌فاصله)', enChar: 'Space', finger: 'thumbs', width: 'flex-1 max-w-xl', isSpecial: true },
    { code: 'AltRight', faChar: 'Alt Gr', enChar: 'Alt', finger: 'right-pinky', width: 'w-12 sm:w-14', isSpecial: true },
    { code: 'ControlRight', faChar: 'Ctrl', enChar: 'Ctrl', finger: 'right-pinky', width: 'w-14 sm:w-16', isSpecial: true },
  ];

  return [row0, row1, row2, row3, row4];
}

// Default export rows
export const KEYBOARD_ROWS = getKeyboardRows('universal');

// Map generator for fast char -> key lookup
export function getCharToKeyMap(layout: KeyboardLayoutType | string = 'universal'): Record<string, KeyDefinition> {
  const map: Record<string, KeyDefinition> = {};
  const rows = getKeyboardRows(layout);

  rows.forEach(row => {
    row.forEach(key => {
      if (key.faChar && !key.isSpecial) {
        map[key.faChar] = key;
      }
      if (key.faShiftChar && !key.isSpecial) {
        map[key.faShiftChar] = key;
      }
    });
  });

  // Base additions
  map[' '] = rows[4][2]; // Spacebar
  map['‌'] = rows[4][2]; // ZWNJ
  map['ي'] = map['ی'] || rows[2][3];
  map['ك'] = map['ک'] || rows[2][10];
  map['آ'] = { code: 'KeyH', faChar: 'آ', enChar: 'h', finger: 'right-index' };
  map['ژ'] = map['ژ'] || { code: 'KeyC', faChar: 'ژ', enChar: 'c', finger: 'left-middle' };
  map['ئ'] = { code: 'KeyS', faChar: 'ئ', enChar: 's', finger: 'left-ring' };
  map['ء'] = { code: 'KeyM', faChar: 'ء', enChar: 'm', finger: 'right-index' };
  map['،'] = { code: 'Digit7', faChar: '،', enChar: '7', finger: 'right-index' };
  map['؟'] = { code: 'Slash', faChar: '؟', enChar: '/', finger: 'right-pinky' };

  // If windows layout, ensure 'پ' points to KeyM
  if (layout === 'windows') {
    map['پ'] = { code: 'KeyM', faChar: 'پ', enChar: 'm', finger: 'right-index' };
    map['ژ'] = { code: 'Backslash', faChar: 'ژ', enChar: '\\', finger: 'right-pinky' };
  } else if (layout === 'isiri') {
    map['پ'] = { code: 'Backslash', faChar: 'پ', enChar: '\\', finger: 'right-pinky' };
    map['ژ'] = { code: 'KeyC', faChar: 'ژ', enChar: 'c', finger: 'left-middle' };
  }

  return map;
}

export const CHAR_TO_KEY_MAP = getCharToKeyMap('universal');
export const CODE_TO_KEY_MAP: Record<string, KeyDefinition> = {};
KEYBOARD_ROWS.forEach(row => {
  row.forEach(key => {
    CODE_TO_KEY_MAP[key.code] = key;
  });
});
