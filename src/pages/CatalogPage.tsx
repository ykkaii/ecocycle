import { useState, useEffect, useMemo } from 'react';
import { FilterBar } from '../components/features/FilterBar';
import type { Filters } from '../components/features/FilterBar';
import { Pagination } from '../components/features/Pagination';
import { RawMaterialCard } from '../components/features/RawMaterialCard';
import { ProductCard } from '../components/features/ProductCard';
import { fetchRawMaterials, fetchProducts } from '../lib/api';
import type { RawMaterial, Product } from '../types';

interface Props {
  kind: 'raw' | 'product';
}

const PER_PAGE = 8;

export const CatalogPage = ({ kind }: Props) => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    region: '',
    sort: 'newest',
  });
  const [page, setPage] = useState(1);

  const [rawItems, setRawItems] = useState<RawMaterial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (kind === 'raw') setRawItems(await fetchRawMaterials());
        else setProducts(await fetchProducts());
      } catch (err: any) {
        setError(err.message ?? 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [kind]);

  // Сбрасываем страницу при изменении фильтров
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const filteredRaw = useMemo(() => {
    if (kind !== 'raw') return [];
    const list = rawItems.filter((item) => {
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.region && !item.location.toLowerCase().includes(filters.region.toLowerCase()))
        return false;
      if (filters.minPrice && item.pricePerTon < Number(filters.minPrice)) return false;
      if (filters.maxPrice && item.pricePerTon > Number(filters.maxPrice)) return false;
      return true;
    });
    return sortItems(list, filters.sort, 'pricePerTon');
  }, [kind, filters, rawItems]);

  const filteredProducts = useMemo(() => {
    if (kind !== 'product') return [];
    const list = products.filter((item) => {
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
      if (filters.category && item.category !== filters.category) return false;
      if (
        filters.region &&
        !(item.location ?? '').toLowerCase().includes(filters.region.toLowerCase())
      )
        return false;
      if (filters.minPrice && item.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && item.price > Number(filters.maxPrice)) return false;
      return true;
    });
    return sortItems(list, filters.sort, 'price');
  }, [kind, filters, products]);

  const totalCount = kind === 'raw' ? filteredRaw.length : filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const rawPage = filteredRaw.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const productPage = filteredProducts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-dark mb-6 tracking-tight">
        {kind === 'raw' ? 'Каталог сырья' : 'Каталог продукции'}
      </h1>

      <FilterBar kind={kind} filters={filters} setFilters={setFilters} />

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-line rounded-card overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-cream" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-cream rounded w-3/4" />
                <div className="h-3 bg-cream rounded w-full" />
                <div className="h-3 bg-cream rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-btn px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && kind === 'raw' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rawPage.map((item) => (
            <RawMaterialCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!loading && !error && kind === 'product' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productPage.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!loading && !error && totalCount === 0 && (
        <p className="text-center text-muted py-16">Ничего не найдено</p>
      )}

      {!loading && !error && totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

// Хелпер сортировки
function sortItems<T extends Record<string, any>>(
  items: T[],
  sort: Filters['sort'],
  priceKey: string
): T[] {
  const copy = [...items];
  switch (sort) {
    case 'oldest':
      return copy.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case 'price_asc':
      return copy.sort((a, b) => (a[priceKey] ?? 0) - (b[priceKey] ?? 0));
    case 'price_desc':
      return copy.sort((a, b) => (b[priceKey] ?? 0) - (a[priceKey] ?? 0));
    case 'newest':
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}