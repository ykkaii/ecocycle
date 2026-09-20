import { Input } from '../ui/Input';
import { RAW_MATERIAL_TYPES, PRODUCT_CATEGORIES } from '../../utils/constants';

export interface Filters {
  search: string;
  type: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  region: string;
  sort: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
}

interface Props {
  kind: 'raw' | 'product';
  filters: Filters;
  setFilters: (f: Filters) => void;
}

export const FilterBar = ({ kind, filters, setFilters }: Props) => {
  const selectClasses =
    'w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark text-sm focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all cursor-pointer';

  return (
    <div className="bg-surface border border-line rounded-card p-4 mb-8 space-y-3">
      {/* Строка 1: поиск + регион + сортировка */}
      <div className="grid md:grid-cols-3 gap-3">
        <Input
          placeholder="Поиск по названию..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Input
          placeholder="Регион (например, Краснодар)"
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
        />
        <select
          className={selectClasses}
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value as Filters['sort'] })
          }
        >
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
        </select>
      </div>

      {/* Строка 2: тип/категория + цена от/до */}
      <div className="grid md:grid-cols-3 gap-3">
        {kind === 'raw' && (
          <select
            className={selectClasses}
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Все типы сырья</option>
            {Object.entries(RAW_MATERIAL_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}

        {kind === 'product' && (
          <select
            className={selectClasses}
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">Все категории</option>
            {Object.entries(PRODUCT_CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}

        <Input
          type="number"
          placeholder="Цена от"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Цена до"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
      </div>
    </div>
  );
};