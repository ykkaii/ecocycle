import { Link } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatPricePer, formatVolume } from '../../utils/format';
import { RAW_MATERIAL_TYPES } from '../../utils/constants';
import type { RawMaterial } from '../../types';

interface Props {
  item: RawMaterial;
}

export const RawMaterialCard = ({ item }: Props) => {
  return (
    <Link to={`/product/${item.id}`} className="block group">
      <Card className="h-full flex flex-col !p-0 overflow-hidden">
        {/* Изображение */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-cream">
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
            <Badge variant="sage">{RAW_MATERIAL_TYPES[item.type]}</Badge>
          </div>
        </div>

        {/* Контент */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          <h3 className="font-bold text-base text-dark tracking-tight mb-1.5 line-clamp-1">
            {item.title}
          </h3>

          <p className="text-sm text-text leading-relaxed line-clamp-2 mb-4">
            {item.description}
          </p>

          <div className="space-y-1.5 mb-5 mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <MapPin className="w-3.5 h-3.5 text-olive" strokeWidth={2} />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Package className="w-3.5 h-3.5 text-olive" strokeWidth={2} />
              <span>{formatVolume(item.volume)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-line flex items-baseline justify-between gap-2">
            <span className="text-lg font-extrabold text-dark tracking-tight">
              {formatPricePer(item.pricePerTon, 'т')}
            </span>
            <span className="text-xs text-muted truncate max-w-[45%] text-right">
              {item.sellerName}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};