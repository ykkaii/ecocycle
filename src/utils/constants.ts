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