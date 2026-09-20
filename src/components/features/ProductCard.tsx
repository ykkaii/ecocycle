import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatPrice, formatMonths } from '../../utils/format';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import type { Product } from '../../types';

interface Props {
  item: Product;
}

export const ProductCard = ({ item }: Props) => {
  return (
    <Link to={`/product/${item.id}`} className="block group">
      <Card className="h-full flex flex-col !p-0 overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              Нет фото
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="olive">{PRODUCT_CATEGORIES[item.category]}</Badge>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-bold text-base text-dark tracking-tight mb-1.5 line-clamp-1">
            {item.title}
          </h3>

          <p className="text-sm text-text leading-relaxed line-clamp-2 mb-4">
            {item.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted mb-5 mt-auto">
            <Leaf className="w-3.5 h-3.5 text-sage" strokeWidth={2} />
            <span>Разлагается за {formatMonths(item.biodegradableMonths)}</span>
          </div>

          <div className="pt-4 border-t border-line flex items-baseline justify-between gap-2">
            <div>
              <span className="text-lg font-extrabold text-dark tracking-tight">
                {formatPrice(item.price)}
              </span>
              <span className="text-xs text-muted ml-1">/ {item.unit}</span>
            </div>
            <span className="text-xs text-muted truncate max-w-[45%] text-right">
              {item.manufacturerName}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};