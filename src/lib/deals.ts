import type { Deal, DealStatus, Review, DealItemKind } from '../types';

const DEALS_KEY = 'ecocycle_deals_v1';
const REVIEWS_KEY = 'ecocycle_reviews_v1';

function loadDeals(): Deal[] {
  try {
    const raw = localStorage.getItem(DEALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDeals(deals: Deal[]) {
  localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
}

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ---------- DEALS ---------- */

export function createDeal(payload: {
  itemKind: DealItemKind;
  itemId: string;
  itemTitle: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string | null;
  sellerId: string;
  sellerName: string;
  volume: number;
  pricePerUnit: number;
  message?: string;
}): Deal {
  const deals = loadDeals();
  const now = new Date().toISOString();
  const deal: Deal = {
    id: uid(),
    itemKind: payload.itemKind,
    itemId: payload.itemId,
    itemTitle: payload.itemTitle,
    buyerId: payload.buyerId,
    buyerName: payload.buyerName,
    buyerEmail: payload.buyerEmail ?? null,
    sellerId: payload.sellerId,
    sellerName: payload.sellerName,
    volume: payload.volume,
    pricePerUnit: payload.pricePerUnit,
    totalPrice: Math.round(payload.volume * payload.pricePerUnit),
    message: payload.message ?? null,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  deals.unshift(deal);
  saveDeals(deals);
  return deal;
}

export function getIncomingDeals(sellerId: string): Deal[] {
  return loadDeals().filter((d) => d.sellerId === sellerId);
}

export function getOutgoingDeals(buyerId: string): Deal[] {
  return loadDeals().filter((d) => d.buyerId === buyerId);
}

export function getSalesHistory(sellerId: string): Deal[] {
  return loadDeals().filter(
    (d) => d.sellerId === sellerId && (d.status === 'accepted' || d.status === 'completed')
  );
}

export function updateDealStatus(dealId: string, status: DealStatus): Deal | null {
  const deals = loadDeals();
  const idx = deals.findIndex((d) => d.id === dealId);
  if (idx === -1) return null;
  deals[idx] = {
    ...deals[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  saveDeals(deals);
  return deals[idx];
}

/* ---------- REVIEWS ---------- */

export function createReview(payload: {
  itemKind: DealItemKind;
  itemId: string;
  authorId: string;
  authorName: string;
  rating: number;
  text: string;
}): Review {
  const reviews = loadReviews();
  const review: Review = {
    id: uid(),
    itemKind: payload.itemKind,
    itemId: payload.itemId,
    authorId: payload.authorId,
    authorName: payload.authorName,
    rating: Math.min(5, Math.max(1, Math.round(payload.rating))),
    text: payload.text.trim(),
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(review);
  saveReviews(reviews);
  return review;
}

export function getReviewsForItem(itemKind: DealItemKind, itemId: string): Review[] {
  return loadReviews().filter((r) => r.itemKind === itemKind && r.itemId === itemId);
}

export function getAverageRating(itemKind: DealItemKind, itemId: string): {
  average: number;
  count: number;
} {
  const list = getReviewsForItem(itemKind, itemId);
  if (list.length === 0) return { average: 0, count: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / list.length) * 10) / 10,
    count: list.length,
  };
}