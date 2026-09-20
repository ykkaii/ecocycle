import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { fetchRawMaterialById, fetchProductById } from '../lib/api';
import { formatPricePer, formatVolume, formatMonths, formatPrice } from '../utils/format';
import type { RawMaterial, Product } from '../types';

const contactSeller = (email: string | null | undefined, subject: string) => {
  if (!email) {
    alert(
      'У продавца не указан email. Свяжитесь через другие каналы или попробуйте позже.'
    );
    return;
  }

  const mailSubject = encodeURIComponent(`Запрос по объявлению: ${subject}`);
  const mailBody = encodeURIComponent(
    `Здравствуйте!\n\n` +
      `Меня заинтересовало ваше объявление "${subject}" на платформе ЭкоЦикл.\n\n` +
      `Подскажите, пожалуйста, подробности:\n` +
      `— актуально ли предложение;\n` +
      `— условия поставки;\n` +
      `— возможные объёмы и сроки.\n\n` +
      `Буду признателен за ответ.\n\n` +
      `С уважением,\n` +
      `[ваше имя]`
  );

  window.location.href = `mailto:${email}?subject=${mailSubject}&body=${mailBody}`;
};

export const ProductPage = () => {
  const { id } = useParams();
  const [rawItem, setRawItem] = useState<RawMaterial | null>(null);
  const [productItem, setProductItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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

  /* ---------- Ветка: сырьё ---------- */
  if (rawItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <Link
          to="/catalog/raw"
          className="inline-flex items-center text-sm text-muted hover:text-sage transition-colors mb-6 md:mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
          Назад в каталог сырья
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          <div className="bg-cream rounded-card overflow-hidden border border-line">
            <img
              src={rawItem.imageUrl || 'https://placehold.co/800x600/E8F0E3/7CA982?text=ЭкоЦикл'}
              alt={rawItem.title}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          <div>
            <Badge variant="sage">Сырьё</Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark tracking-tightest leading-tight mt-4 mb-4 md:mb-5">
              {rawItem.title}
            </h1>

            <p className="text-base sm:text-lg text-text leading-relaxed mb-6 md:mb-8">
              {rawItem.description}
            </p>

            <div className="space-y-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-line">
              <div className="flex items-center gap-2.5 text-sm text-text">
                <MapPin className="w-4 h-4 text-olive" strokeWidth={2} />
                {rawItem.location}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-text">
                <Package className="w-4 h-4 text-olive" strokeWidth={2} />
                Объём: {formatVolume(rawItem.volume)}
              </div>
            </div>

            <Card hover={false} className="bg-cream border-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tightest mb-2">
                {formatPricePer(rawItem.pricePerTon, 'т')}
              </div>
              <p className="text-sm text-muted mb-6">
                Продавец:{' '}
                <span className="text-text font-medium">{rawItem.sellerName}</span>
              </p>
              <Button
                fullWidth
                size="lg"
                onClick={() => contactSeller(rawItem.sellerEmail, rawItem.title)}
              >
                Связаться с продавцом
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Ветка: продукция ---------- */
  if (!productItem) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <Link
        to="/catalog/products"
        className="inline-flex items-center text-sm text-muted hover:text-sage transition-colors mb-6 md:mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
        Назад в каталог продукции
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
        <div className="bg-cream rounded-card overflow-hidden border border-line">
          <img
            src={productItem.imageUrl || 'https://placehold.co/800x600/E8F0E3/7CA982?text=ЭкоЦикл'}
            alt={productItem.title}
            className="w-full aspect-[4/3] object-cover"
          />
        </div>

        <div>
          <Badge variant="olive">Продукция</Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark tracking-tightest leading-tight mt-4 mb-4 md:mb-5">
            {productItem.title}
          </h1>

          <p className="text-base sm:text-lg text-text leading-relaxed mb-6 md:mb-8">
            {productItem.description}
          </p>

          <div className="space-y-3 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-line">
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
          </div>

          <Card hover={false} className="bg-cream border-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tightest mb-2">
              {formatPrice(productItem.price)}
              <span className="text-base text-muted font-medium ml-1">
                / {productItem.unit}
              </span>
            </div>
            <p className="text-sm text-muted mb-6">
              Производитель:{' '}
              <span className="text-text font-medium">
                {productItem.manufacturerName}
              </span>
            </p>
            <Button
              fullWidth
              size="lg"
              onClick={() =>
                contactSeller(productItem.manufacturerEmail, productItem.title)
              }
            >
              Связаться с производителем
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};