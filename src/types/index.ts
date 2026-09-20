export type UserRole = 'supplier' | 'buyer';

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