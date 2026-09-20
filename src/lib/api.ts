import { supabase } from './supabase';
import type {
  RawMaterial,
  Product,
  RecyclingPoint,
  RecyclingRequest,
  RecyclingCategory,
  RecyclingSourceKind,
  RecyclingStatus,
} from '../types';

/* ---------- СЫРЬЁ ---------- */

export const fetchRawMaterials = async (): Promise<RawMaterial[]> => {
  const { data, error } = await supabase
    .from('raw_materials')
    .select(`*, profiles:seller_id ( name, email )`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    description: row.description,
    pricePerTon: Number(row.price_per_ton),
    volume: Number(row.volume),
    location: row.location,
    imageUrl: row.image_url ?? undefined,
    sellerId: row.seller_id,
    sellerName: row.profiles?.name ?? 'Неизвестный продавец',
    sellerEmail: row.profiles?.email ?? null,
    createdAt: row.created_at,
  }));
};



export const fetchRawMaterialById = async (
  id: string
): Promise<RawMaterial | null> => {
  const { data, error } = await supabase
    .from('raw_materials')
    .select(`*, profiles:seller_id ( name, email )`)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    type: data.type,
    description: data.description,
    pricePerTon: Number(data.price_per_ton),
    volume: Number(data.volume),
    location: data.location,
    imageUrl: data.image_url ?? undefined,
    sellerId: data.seller_id,
    sellerName: (data as any).profiles?.name ?? 'Неизвестный продавец',
    sellerEmail: (data as any).profiles?.email ?? null,
    createdAt: data.created_at,
  };
};

/* ---------- ПРОДУКЦИЯ ---------- */

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`*, profiles:manufacturer_id ( name, email )`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    price: Number(row.price),
    unit: row.unit,
    location: row.location ?? undefined,
    imageUrl: row.image_url ?? undefined,
    manufacturerId: row.manufacturer_id,
    manufacturerName: row.profiles?.name ?? 'Неизвестный производитель',
    manufacturerEmail: row.profiles?.email ?? null,
    biodegradableMonths: row.biodegradable_months,
    createdAt: row.created_at,
  }));
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(`*, profiles:manufacturer_id ( name, email )`)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    category: data.category,
    description: data.description,
    price: Number(data.price),
    unit: data.unit,
    location: data.location ?? undefined,
    imageUrl: data.image_url ?? undefined,
    manufacturerId: data.manufacturer_id,
    manufacturerName:
      (data as any).profiles?.name ?? 'Неизвестный производитель',
    manufacturerEmail: (data as any).profiles?.email ?? null,
    biodegradableMonths: data.biodegradable_months,
    createdAt: data.created_at,
  };
};

/* ---------- ПЕРЕРАБОТКА ---------- */

export const fetchRecyclingPoints = async (): Promise<RecyclingPoint[]> => {
  const { data, error } = await supabase
    .from('recycling_points')
    .select('*')
    .order('region', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    region: row.region,
    phone: row.phone,
    email: row.email,
    accepts: row.accepts ?? [],
    workingHours: row.working_hours,
    description: row.description,
    latitude: row.latitude ? Number(row.latitude) : null,
    longitude: row.longitude ? Number(row.longitude) : null,
  }));
};

export const fetchMyRecyclingRequests = async (
  userId: string
): Promise<RecyclingRequest[]> => {
  const { data, error } = await supabase
    .from('recycling_requests')
    .select(`*, recycling_points:point_id ( name )`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    pointId: row.point_id,
    pointName: row.recycling_points?.name ?? '—',
    sourceKind: row.source_kind ?? 'product',
    category: row.category,
    rawType: row.raw_type,
    volume: Number(row.volume),
    comment: row.comment,
    adminComment: row.admin_comment,
    status: row.status,
    createdAt: row.created_at,
  }));
};

export const createRecyclingRequest = async (payload: {
  userId: string;
  pointId: string;
  category: RecyclingCategory;
  volume: number;
  comment?: string;
}) => {
  const { error } = await supabase.from('recycling_requests').insert({
    user_id: payload.userId,
    point_id: payload.pointId,
    category: payload.category,
    volume: payload.volume,
    comment: payload.comment || null,
  });
  if (error) throw error;
};

/* ---------- ПЕРЕРАБОТКА: расширенно ---------- */

export const createRecyclingRequestExtended = async (payload: {
  userId: string;
  pointId: string;
  sourceKind: RecyclingSourceKind;
  category?: RecyclingCategory;
  rawType?: 'rice_straw' | 'beet_pulp' | 'manure';
  volume: number;
  comment?: string;
}) => {
  const { error } = await supabase.from('recycling_requests').insert({
    user_id: payload.userId,
    point_id: payload.pointId,
    source_kind: payload.sourceKind,
    category: payload.category ?? null,
    raw_type: payload.rawType ?? null,
    volume: payload.volume,
    comment: payload.comment || null,
  });
  if (error) throw error;
};

export const fetchAllRecyclingRequests = async (): Promise<RecyclingRequest[]> => {
  const { data, error } = await supabase
    .from('recycling_requests')
    .select(`
      *,
      recycling_points:point_id ( name ),
      profiles:user_id ( name, email )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.profiles?.name ?? '—',
    userEmail: row.profiles?.email ?? '—',
    pointId: row.point_id,
    pointName: row.recycling_points?.name ?? '—',
    sourceKind: row.source_kind,
    category: row.category,
    rawType: row.raw_type,
    volume: Number(row.volume),
    comment: row.comment,
    adminComment: row.admin_comment,
    status: row.status,
    createdAt: row.created_at,
  }));
};

export const updateRecyclingRequestStatus = async (
  id: string,
  status: RecyclingStatus,
  adminComment?: string
) => {
  const { error } = await supabase
    .from('recycling_requests')
    .update({ status, admin_comment: adminComment ?? null })
    .eq('id', id);
  if (error) throw error;
};