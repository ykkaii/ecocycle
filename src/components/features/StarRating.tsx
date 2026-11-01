import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const StarRating = ({
  value,
  onChange,
  size = 'md',
  readonly = false,
}: StarRatingProps) => {
  const cls = sizeMap[size];

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly || !onChange}
            onClick={() => onChange?.(star)}
            className={`${
              readonly || !onChange ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } transition-transform`}
            aria-label={`${star} звезд`}
          >
            <Star
              className={`${cls} ${
                filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
              }`}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};