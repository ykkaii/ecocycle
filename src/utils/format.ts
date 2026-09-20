/**
 * Форматирование цены в рубли с разделителями тысяч.
 * Пример: 2500 → "2 500 ₽"
 */
export const formatPrice = (value: number): string => {
  return `${value.toLocaleString('ru-RU')} ₽`;
};

/**
 * Форматирование цены за единицу измерения.
 * Пример: formatPricePer(2500, 'т') → "2 500 ₽/т"
 */
export const formatPricePer = (value: number, unit: string): string => {
  return `${value.toLocaleString('ru-RU')} ₽/${unit}`;
};

/**
 * Форматирование объёма с единицей измерения.
 * Пример: formatVolume(500, 'тонн') → "500 тонн"
 */
export const formatVolume = (value: number, unit: string = 'тонн'): string => {
  return `${value.toLocaleString('ru-RU')} ${unit}`;
};

/**
 * Форматирование даты из ISO-строки в русский формат.
 * Пример: "2026-02-10" → "10 февраля 2026"
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Форматирование даты в короткий формат.
 * Пример: "2026-02-10" → "10.02.2026"
 */
export const formatDateShort = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('ru-RU');
};

/**
 * Обрезка длинного текста с многоточием.
 * Пример: truncate("Очень длинное описание...", 30) → "Очень длинное описание..."
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
};

/**
 * Склонение существительных после чисел.
 * Пример: pluralize(5, 'тонна', 'тонны', 'тонн') → "тонн"
 *         pluralize(2, 'тонна', 'тонны', 'тонн') → "тонны"
 *         pluralize(1, 'тонна', 'тонны', 'тонн') → "тонна"
 */
export const pluralize = (
  count: number,
  one: string,
  few: string,
  many: string
): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};

/**
 * Форматирование числа с существительным в правильной форме.
 * Пример: formatCount(5, 'тонна', 'тонны', 'тонн') → "5 тонн"
 */
export const formatCount = (
  count: number,
  one: string,
  few: string,
  many: string
): string => {
  return `${count.toLocaleString('ru-RU')} ${pluralize(count, one, few, many)}`;
};

/**
 * Склонение месяцев (для срока разложения).
 * Пример: formatMonths(4) → "4 месяца", formatMonths(6) → "6 месяцев"
 */
export const formatMonths = (months: number): string => {
  return formatCount(months, 'месяц', 'месяца', 'месяцев');
};

/**
 * Получение инициалов из имени.
 * Пример: getInitials("Иван Иванов") → "ИИ"
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

/**
 * Преобразование первой буквы в заглавную.
 * Пример: capitalize("рисовая солома") → "Рисовая солома"
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text[0].toUpperCase() + text.slice(1);
};