export type UserRole =
  | 'supplier'          // Поставщик сырья
  | 'producer'          // Производитель
  | 'buyer'             // Покупатель
  | 'collection_point'  // Пункт приёма
  | 'admin';             // Администратор

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  company: string | null;
  email?: string | null;
}

export interface RawMaterial {
  id: string;
  title: string;
  type: 'rice_straw' | 'beet_pulp' | 'manure';
  description: string;
  pricePerTon: number;
  volume: number;
  location: string;
  imageUrl?: string;
  sellerId: string;
  sellerName?: string;
  sellerEmail?: string | null;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  category: 'tableware' | 'pots' | 'cassettes' | 'trays';
  description: string;
  price: number;
  unit: string;
  location?: string;
  imageUrl?: string;
  manufacturerId: string;
  manufacturerName?: string;
  manufacturerEmail?: string | null;
  biodegradableMonths: number;
  createdAt: string;
}

export type RecyclingCategory = 'tableware' | 'pots' | 'cassettes' | 'trays';

export type RecyclingSourceKind = 'raw' | 'product';

export type RecyclingStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface RecyclingPoint {
  id: string;
  name: string;
  address: string;
  region: string;
  phone?: string | null;
  email?: string | null;
  accepts: RecyclingCategory[];
  workingHours?: string | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface RecyclingRequest {
  id: string;
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  pointId: string | null;
  pointName?: string | null;
  sourceKind: RecyclingSourceKind;
  category: RecyclingCategory | null;
  rawType: 'rice_straw' | 'beet_pulp' | 'manure' | null;
  volume: number;
  comment?: string | null;
  adminComment?: string | null;
  status: RecyclingStatus;
  createdAt: string;
}

/* ---------- СДЕЛКИ / ЗАЯВКИ ---------- */

export type DealStatus =
  | 'pending'    // ожидает ответа поставщика
  | 'accepted'   // поставщик подтвердил
  | 'rejected'   // поставщик отклонил
  | 'completed'  // сделка завершена
  | 'cancelled'; // отменена покупателем

export type DealItemKind = 'raw' | 'product';

export interface Deal {
  id: string;
  itemKind: DealItemKind;
  itemId: string;
  itemTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string | null;
  sellerId: string;
  sellerName: string;
  volume: number;          // тонн для сырья, штук для продукции
  pricePerUnit: number;    // цена за тонну / за единицу
  totalPrice: number;
  message?: string | null;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
}

/* ---------- ОТЗЫВЫ И РЕЙТИНГИ ---------- */

export interface Review {
  id: string;
  itemKind: DealItemKind;
  itemId: string;
  authorId: string;
  authorName: string;
  rating: number;          // 1–5
  text: string;
  createdAt: string;
}