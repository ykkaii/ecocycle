import type { RawMaterial, Product } from '../types';

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

import type { RecyclingStatus } from '../types';

export const RECYCLING_STATUSES: Record<RecyclingStatus, string> = {
  pending: 'На рассмотрении',
  accepted: 'Принята',
  completed: 'Завершена',
  rejected: 'Отклонена',
};

export const RECYCLING_STATUS_COLORS: Record<
  RecyclingStatus,
  'sage' | 'lime' | 'olive' | 'dark'
> = {
  pending: 'lime',
  accepted: 'sage',
  completed: 'sage',
  rejected: 'olive',
};