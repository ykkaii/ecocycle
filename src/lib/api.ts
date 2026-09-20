import { supabase } from './supabase';
import type { RawMaterial, Product } from '../types';

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

export const fetchRawMaterialById = async (id: string): Promise<RawMaterial | null> => {
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
    manufacturerName: (data as any).profiles?.name ?? 'Неизвестный производитель',
    manufacturerEmail: (data as any).profiles?.email ?? null,
    biodegradableMonths: data.biodegradable_months,
    createdAt: data.created_at,
  };
};