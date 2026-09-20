import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Recycle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  fetchRecyclingPoints,
  createRecyclingRequest,
  fetchMyRecyclingRequests,
} from '../lib/api';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import { formatDate } from '../utils/format';
import type {
  RecyclingPoint,
  RecyclingRequest,
  RecyclingCategory,
} from '../types';

export const RecyclingPage = () => {
  const { user } = useAuth();

  const [points, setPoints] = useState<RecyclingPoint[]>([]);
  const [myRequests, setMyRequests] = useState<RecyclingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'' | RecyclingCategory>('');

  // Форма заявки
  const [form, setForm] = useState({
    pointId: '',
    category: 'tableware' as RecyclingCategory,
    volume: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pts, reqs] = await Promise.all([
          fetchRecyclingPoints(),
          user ? fetchMyRecyclingRequests(user.id) : Promise.resolve([]),
        ]);
        setPoints(pts);
        setMyRequests(reqs);
        if (pts.length > 0) setForm((f) => ({ ...f, pointId: pts[0].id }));
      } catch (err: any) {
        setError(err.message ?? 'Не удалось загрузить пункты приёма');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const filteredPoints = useMemo(() => {
    return points.filter((p) => {
      if (regionFilter && !p.region.toLowerCase().includes(regionFilter.toLowerCase()))
        return false;
      if (categoryFilter && !p.accepts.includes(categoryFilter)) return false;
      return true;
    });
  }, [points, regionFilter, categoryFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSubmitError('Войдите, чтобы оставить заявку');
      return;
    }
    if (!form.pointId) {
      setSubmitError('Выберите пункт приёма');
      return;
    }

    setSubmitError('');
    setSubmitting(true);

    try {
      await createRecyclingRequest({
        userId: user.id,
        pointId: form.pointId,
        category: form.category,
        volume: Number(form.volume),
        comment: form.comment,
      });

      // Перезагружаем заявки
      const reqs = await fetchMyRecyclingRequests(user.id);
      setMyRequests(reqs);

      setSuccess(true);
      setForm((f) => ({ ...f, volume: '', comment: '' }));
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setSubmitError(err.message ?? 'Не удалось отправить заявку');
    } finally {
      setSubmitting(false);
    }
  };

  const selectClasses =
    'w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark text-sm focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all cursor-pointer';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Заголовок */}
      <div className="mb-8 md:mb-12">
        <Badge variant="sage">Замкнутый цикл</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark tracking-tightest leading-tight mt-4 mb-4">
          Переработка продукции
        </h1>
        <p className="text-base sm:text-lg text-text leading-relaxed max-w-2xl">
          Сдайте использованную биоразлагаемую продукцию в ближайший пункт приёма —
          она вернётся в производство или превратится в компост.
        </p>
      </div>

      {/* Как это работает */}
      <section className="mb-10 md:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            { icon: Recycle, title: 'Выбираете пункт', text: 'Найдите ближайший пункт приёма на карте или в списке.' },
            { icon: CheckCircle2, title: 'Оставляете заявку', text: 'Укажите категорию и объём — мы передадим пункту.' },
            { icon: Clock, title: 'Пункт подтверждает', text: 'В течение 1–2 дней пункт свяжется с вами для уточнения.' },
            { icon: CheckCircle2, title: 'Сдаёте продукцию', text: 'Привозите продукцию, получаете подтверждение о переработке.' },
          ].map((step, i) => (
            <Card key={i} className="!p-5 md:!p-6">
              <div className="w-10 h-10 bg-sage-light rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-5 h-5 text-sage-dark" strokeWidth={2.2} />
              </div>
              <div className="text-xs text-muted font-semibold mb-1">ШАГ {i + 1}</div>
              <h3 className="font-bold text-base text-dark mb-2">{step.title}</h3>
              <p className="text-sm text-text leading-relaxed">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Список пунктов + фильтры */}
      <section className="mb-10 md:mb-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight mb-5 md:mb-6">
          Пункты приёма
        </h2>

        <div className="bg-surface border border-line rounded-card p-3 sm:p-4 mb-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Регион (например, Краснодарский край)"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            />
            <select
              className={selectClasses}
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as '' | RecyclingCategory)
              }
            >
              <option value="">Все категории</option>
              {Object.entries(PRODUCT_CATEGORIES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface border border-line rounded-card p-5 animate-pulse space-y-3"
              >
                <div className="h-4 bg-cream rounded w-2/3" />
                <div className="h-3 bg-cream rounded w-full" />
                <div className="h-3 bg-cream rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-btn px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && filteredPoints.length === 0 && (
          <p className="text-center text-muted py-10">
            По вашему фильтру пунктов не найдено
          </p>
        )}

        {!loading && !error && filteredPoints.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredPoints.map((point) => (
              <Card key={point.id} className="!p-5 md:!p-6 flex flex-col">
                <h3 className="font-bold text-base text-dark mb-3 line-clamp-1">
                  {point.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-xs text-muted">
                    <MapPin className="w-3.5 h-3.5 text-olive mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span>{point.address}</span>
                  </div>
                  {point.workingHours && (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Clock className="w-3.5 h-3.5 text-olive" strokeWidth={2} />
                      <span>{point.workingHours}</span>
                    </div>
                  )}
                  {point.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Phone className="w-3.5 h-3.5 text-olive" strokeWidth={2} />
                      <span>{point.phone}</span>
                    </div>
                  )}
                  {point.email && (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Mail className="w-3.5 h-3.5 text-olive" strokeWidth={2} />
                      <span className="truncate">{point.email}</span>
                    </div>
                  )}
                </div>

                {point.description && (
                  <p className="text-sm text-text leading-relaxed mb-4 line-clamp-2">
                    {point.description}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-line">
                  <div className="text-xs text-muted mb-2">Принимает:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {point.accepts.map((cat) => (
                      <Badge key={cat} variant="sage">
                        {PRODUCT_CATEGORIES[cat]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Форма заявки */}
      <section className="mb-10 md:mb-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight mb-5 md:mb-6">
          Оставить заявку
        </h2>

        {!user ? (
          <Card hover={false} className="text-center py-8">
            <p className="text-text mb-6">
              Чтобы оставить заявку на переработку, войдите или зарегистрируйтесь.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button fullWidth className="sm:w-auto">Войти</Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="outline" fullWidth className="sm:w-auto">
                  Регистрация
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card hover={false}>
            {success && (
              <div className="bg-sage-light text-sage-dark text-sm rounded-btn px-4 py-3 mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                Заявка отправлена! Пункт приёма свяжется с вами.
              </div>
            )}

            {submitError && (
              <div className="bg-red-50 text-red-700 text-sm rounded-btn px-4 py-3 mb-5">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Пункт приёма
                </label>
                <select
                  className={selectClasses}
                  value={form.pointId}
                  onChange={(e) => setForm({ ...form, pointId: e.target.value })}
                  required
                >
                  <option value="">Выберите пункт</option>
                  {points.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.address}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Категория продукции
                </label>
                <select
                  className={selectClasses}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as RecyclingCategory })
                  }
                >
                  {Object.entries(PRODUCT_CATEGORIES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Объём (кг)"
                type="number"
                placeholder="10"
                value={form.volume}
                onChange={(e) => setForm({ ...form, volume: e.target.value })}
                required
                min={0}
              />

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Комментарий (необязательно)
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark text-sm focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all"
                  rows={3}
                  placeholder="Например: посуда после мероприятия, требуется самовывоз"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
              </div>

              <Button type="submit" fullWidth size="lg" disabled={submitting}>
                {submitting ? 'Отправляем...' : 'Отправить заявку'}
              </Button>
            </form>
          </Card>
        )}
      </section>

      {/* Мои заявки */}
      {user && myRequests.length > 0 && (
        <section>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight mb-5 md:mb-6">
            Мои заявки
          </h2>
          <div className="space-y-3">
            {myRequests.map((req) => (
              <Card key={req.id} className="!p-4 md:!p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant="sage">{PRODUCT_CATEGORIES[req.category]}</Badge>
                      <Badge variant={req.status === 'rejected' ? 'olive' : 'lime'}>
                        {req.status === 'pending' && 'На рассмотрении'}
                        {req.status === 'accepted' && 'Принята'}
                        {req.status === 'completed' && 'Завершена'}
                        {req.status === 'rejected' && 'Отклонена'}
                      </Badge>
                    </div>
                    <p className="font-semibold text-dark truncate">
                      {req.pointName}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {req.volume} кг · {formatDate(req.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};