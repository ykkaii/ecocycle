import type {
  RawMaterial,
  Product,
  RecyclingStatus,
} from '../types';

export const RAW_MATERIAL_TYPES: Record<RawMaterial['type'], string> = {
  rice_straw: 'Рисовая солома',
  beet_pulp: 'Свекловичный жом',
  manure: 'Коровяк',
};

export const PRODUCT_CATEGORIES: Record<Product['category'], string> = {
  tableware: 'Посуда',
  pots: 'Горшки',
  cassettes: 'Кассеты',
  trays: 'Лотки',
};

export const RECYCLING_STATUSES: Record<RecyclingStatus, string> = {
  pending: 'На рассмотрении',
  accepted: 'Принята',
  in_progress: 'В переработке',
  completed: 'Завершена',
  rejected: 'Отклонена',
};

export const RECYCLING_STATUS_COLORS: Record<
  RecyclingStatus,
  'sage' | 'lime' | 'olive' | 'dark'
> = {
  pending: 'lime',
  accepted: 'sage',
  in_progress: 'sage',
  completed: 'sage',
  rejected: 'olive',
};

// Цикл переработки — этапы, которые видит пользователь
export const RECYCLING_CYCLE: { key: RecyclingStatus; label: string; description: string }[] = [
  {
    key: 'pending',
    label: 'Заявка отправлена',
    description: 'Пункт приёма получил вашу заявку и рассматривает её.',
  },
  {
    key: 'accepted',
    label: 'Заявка принята',
    description: 'Пункт подтвердил заявку и готов принять продукцию.',
  },
  {
    key: 'in_progress',
    label: 'В переработке',
    description: 'Материал перерабатывается в компост или новое сырьё.',
  },
  {
    key: 'completed',
    label: 'Переработка завершена',
    description: 'Материал вернулся в цикл. Спасибо за вклад в экологию!',
  },
];

// Индекс этапа в цикле (для rejected возвращаем -1)
export const cycleIndex = (status: RecyclingStatus): number => {
  const idx = RECYCLING_CYCLE.findIndex((s) => s.key === status);
  return idx;
};