import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, Calendar, Send, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { StarRating } from '../components/features/StarRating';
import { fetchRawMaterialById, fetchProductById } from '../lib/api';
import {
  createDeal,
  createReview,
  getReviewsForItem,
  getAverageRating,
} from '../lib/deals';
import { useAuth } from '../context/AuthContext';
import { formatPricePer, formatVolume, formatMonths, formatPrice, formatDate } from '../utils/format';
import type { RawMaterial, Product, Review } from '../types';

export const ProductPage = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();

  const [rawItem, setRawItem] = useState<RawMaterial | null>(null);
  const [productItem, setProductItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Заявка
  const [showDealForm, setShowDealForm] = useState(false);
  const [dealVolume, setDealVolume] = useState('');
  const [dealMessage, setDealMessage] = useState('');
  const [dealSending, setDealSending] = useState(false);
  const [dealSuccess, setDealSuccess] = useState(false);
  const [dealError, setDealError] = useState('');

  // Отзывы
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState({ average: 0, count: 0 });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const loadReviews = (kind: 'raw' | 'product', itemId: string) => {
    setReviews(getReviewsForItem(kind, itemId));
    setAvgRating(getAverageRating(kind, itemId));
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const [raw, product] = await Promise.all([
          fetchRawMaterialById(id),
          fetchProductById(id),
        ]);
        setRawItem(raw);
        setProductItem(product);
        if (!raw && !product) setNotFound(true);
        else if (raw) loadReviews('raw', raw.id);
        else if (product) loadReviews('product', product.id);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCreateDeal = async () => {
    if (!user || !profile) {
      setDealError('Войдите, чтобы отправить заявку');
      return;
    }
    const volume = Number(dealVolume);
    if (!volume || volume <= 0) {
      setDealError('Укажите корректный объём');
      return;
    }

    setDealSending(true);
    setDealError('');
    try {
      if (rawItem) {
        createDeal({
          itemKind: 'raw',
          itemId: rawItem.id,
          itemTitle: rawItem.title,
          buyerId: user.id,
          buyerName: profile.name,
          buyerEmail: profile.email,
          sellerId: rawItem.sellerId,
          sellerName: rawItem.sellerName || 'Продавец',
          volume,
          pricePerUnit: rawItem.pricePerTon,
          message: dealMessage || undefined,
        });
      } else if (productItem) {
        createDeal({
          itemKind: 'product',
          itemId: productItem.id,
          itemTitle: productItem.title,
          buyerId: user.id,
          buyerName: profile.name,
          buyerEmail: profile.email,
          sellerId: productItem.manufacturerId,
          sellerName: productItem.manufacturerName || 'Производитель',
          volume,
          pricePerUnit: productItem.price,
          message: dealMessage || undefined,
        });
      }
      setDealSuccess(true);
      setShowDealForm(false);
      setDealVolume('');
      setDealMessage('');
    } catch {
      setDealError('Не удалось отправить заявку');
    } finally {
      setDealSending(false);
    }
  };

  const handleCreateReview = () => {
    if (!user || !profile) return;
    if (!reviewText.trim()) return;

    setReviewSending(true);
    try {
      const kind = rawItem ? 'raw' : 'product';
      const itemId = rawItem?.id || productItem?.id || '';
      createReview({
        itemKind: kind,
        itemId,
        authorId: user.id,
        authorName: profile.name,
        rating: reviewRating,
        text: reviewText,
      });
      loadReviews(kind, itemId);
      setReviewSuccess(true);
      setReviewText('');
      setReviewRating(5);
    } finally {
      setReviewSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center text-muted">
        Загрузка...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-4 tracking-tight">
          Товар не найден
        </h1>
        <p className="text-text mb-8">
          Возможно, объявление было удалено или ссылка устарела.
        </p>
        <Link to="/">
          <Button variant="outline">На главную</Button>
        </Link>
      </div>
    );
  }

  const isRaw = !!rawItem;
  const item = rawItem || productItem!;
  const sellerId = rawItem?.sellerId || productItem?.manufacturerId;
  const isOwn = user && sellerId === user.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <Link
        to={isRaw ? '/catalog/raw' : '/catalog/products'}
        className="inline-flex items-center text-sm text-muted hover:text-sage transition-colors mb-6 md:mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
        {isRaw ? 'Назад в каталог сырья' : 'Назад в каталог продукции'}
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
        <div className="bg-cream rounded-card overflow-hidden border border-line">
          <img
            src={item.imageUrl || 'https://placehold.co/800x600/E8F0E3/7CA982?text=ЭкоЦикл'}
            alt={item.title}
            className="w-full aspect-[4/3] object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={isRaw ? 'sage' : 'olive'}>
              {isRaw ? 'Сырьё' : 'Продукция'}
            </Badge>
            {avgRating.count > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating value={avgRating.average} readonly size="sm" />
                <span className="text-sm text-muted">
                  {avgRating.average} ({avgRating.count})
                </span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark tracking-tightest leading-tight mt-4 mb-4 md:mb-5">
            {item.title}
          </h1>

          <p className="text-base sm:text-lg text-text leading-relaxed mb-6 md:mb-8">
            {item.description}
          </p>

          <div className="space-y-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-line">
            {isRaw && rawItem && (
              <>
                <div className="flex items-center gap-2.5 text-sm text-text">
                  <MapPin className="w-4 h-4 text-olive" strokeWidth={2} />
                  {rawItem.location}
                </div>
                <div className="flex items-center gap-2.5 text-sm text-text">
                  <Package className="w-4 h-4 text-olive" strokeWidth={2} />
                  Объём: {formatVolume(rawItem.volume)}
                </div>
              </>
            )}
            {!isRaw && productItem && (
              <>
                <div className="flex items-center gap-2.5 text-sm text-text">
                  <Calendar className="w-4 h-4 text-olive" strokeWidth={2} />
                  Разлагается за {formatMonths(productItem.biodegradableMonths)}
                </div>
                {productItem.location && (
                  <div className="flex items-center gap-2.5 text-sm text-text">
                    <MapPin className="w-4 h-4 text-olive" strokeWidth={2} />
                    {productItem.location}
                  </div>
                )}
              </>
            )}
          </div>

          <Card hover={false} className="bg-cream border-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tightest mb-2">
              {isRaw && rawItem
                ? formatPricePer(rawItem.pricePerTon, 'т')
                : productItem && (
                    <>
                      {formatPrice(productItem.price)}
                      <span className="text-base text-muted font-medium ml-1">
                        / {productItem.unit}
                      </span>
                    </>
                  )}
            </div>
            <p className="text-sm text-muted mb-6">
              {isRaw ? 'Продавец' : 'Производитель'}:{' '}
              <span className="text-text font-medium">
                {isRaw ? rawItem?.sellerName : productItem?.manufacturerName}
              </span>
            </p>

            {dealSuccess ? (
              <div className="rounded-btn bg-sage/15 text-sage px-4 py-3 text-sm font-medium text-center">
                Заявка отправлена! Продавец получит уведомление в личном кабинете.
              </div>
            ) : isOwn ? (
              <p className="text-sm text-muted text-center">Это ваше объявление</p>
            ) : showDealForm ? (
              <div className="space-y-3">
                <Input
                  label={isRaw ? 'Объём (тонн)' : `Количество (${productItem?.unit})`}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={dealVolume}
                  onChange={(e) => setDealVolume(e.target.value)}
                  placeholder="Например: 10"
                />
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Сообщение (необязательно)
                  </label>
                  <textarea
                    className="w-full rounded-btn border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40"
                    rows={3}
                    value={dealMessage}
                    onChange={(e) => setDealMessage(e.target.value)}
                    placeholder="Укажите желаемые сроки, условия доставки..."
                  />
                </div>
                {dealError && (
                  <p className="text-sm text-red-600">{dealError}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    fullWidth
                    onClick={handleCreateDeal}
                    disabled={dealSending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {dealSending ? 'Отправляем...' : 'Отправить заявку'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDealForm(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                fullWidth
                size="lg"
                onClick={() => {
                  if (!user) {
                    setDealError('Войдите, чтобы отправить заявку');
                    return;
                  }
                  setShowDealForm(true);
                  setDealError('');
                }}
              >
                Оставить заявку на сделку
              </Button>
            )}
            {dealError && !showDealForm && (
              <p className="text-sm text-red-600 mt-2 text-center">{dealError}</p>
            )}
          </Card>
        </div>
      </div>

      {/* ---------- ОТЗЫВЫ ---------- */}
      <div className="mt-12 md:mt-16">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-5 h-5 text-olive" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-dark tracking-tight">
            Отзывы и рейтинг
          </h2>
          {avgRating.count > 0 && (
            <span className="text-sm text-muted">
              {avgRating.average} / 5 · {avgRating.count} отзывов
            </span>
          )}
        </div>

        {user && profile && !reviewSuccess && (
          <Card hover={false} className="mb-6">
            <p className="text-sm font-medium text-dark mb-3">Оставить отзыв</p>
            <div className="mb-3">
              <StarRating value={reviewRating} onChange={setReviewRating} />
            </div>
            <textarea
              className="w-full rounded-btn border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 mb-3"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Поделитесь впечатлением о качестве, сроках, коммуникации..."
            />
            <Button
              size="sm"
              onClick={handleCreateReview}
              disabled={reviewSending || !reviewText.trim()}
            >
              {reviewSending ? 'Отправляем...' : 'Опубликовать отзыв'}
            </Button>
          </Card>
        )}
        {reviewSuccess && (
          <div className="rounded-btn bg-sage/15 text-sage px-4 py-3 text-sm font-medium mb-6">
            Спасибо! Ваш отзыв опубликован.
          </div>
        )}
        {!user && (
          <p className="text-sm text-muted mb-6">
            <Link to="/login" className="text-sage hover:underline">
              Войдите
            </Link>
            , чтобы оставить отзыв.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-muted">Пока нет отзывов. Будьте первым!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-btn border border-line p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-dark text-sm">
                      {r.authorName}
                    </span>
                    <StarRating value={r.rating} readonly size="sm" />
                  </div>
                  <span className="text-xs text-muted">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-text leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};