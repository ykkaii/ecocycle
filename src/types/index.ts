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

export type RecyclingCategory = 'tableware' | 'pots' | 'cassettes' | 'trays';
export type RecyclingStatus = 'pending' | 'accepted' | 'completed' | 'rejected';

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
}

export interface RecyclingRequest {
  id: string;
  userId: string;
  pointId: string | null;
  pointName?: string | null;
  category: RecyclingCategory;
  volume: number;
  comment?: string | null;
  status: RecyclingStatus;
  createdAt: string;
}