import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Pencil, Recycle, Check, X, Handshake } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RecyclingCycle } from '../components/features/RecyclingCycle';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { fetchMyRecyclingRequests } from '../lib/api';
import {
  getIncomingDeals,
  getSalesHistory,
  getOutgoingDeals,
  updateDealStatus,
} from '../lib/deals';
import { formatPrice, formatPricePer, formatDate } from '../utils/format';
import {
  RAW_MATERIAL_TYPES,
  PRODUCT_CATEGORIES,
  RECYCLING_STATUSES,
  RECYCLING_STATUS_COLORS,
} from '../utils/constants';
import type { RecyclingRequest, Deal } from '../types';

interface MyRaw {
  id: string;
  title: string;
  type: 'rice_straw' | 'beet_pulp' | 'manure';
  price_per_ton: number;
}

interface MyProduct {
  id: string;
  title: string;
  category: 'tableware' | 'pots' | 'cassettes' | 'trays';
  price: number;
  unit: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, refreshProfile } = useAuth();

  // Объявления
  const [myRaw, setMyRaw] = useState<MyRaw[]>([]);
  const [myProducts, setMyProducts] = useState<MyProduct[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Заявки на переработку
  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [openRequestId, setOpenRequestId] = useState<string | null>(null);

  // Сделки
  const [incomingDeals, setIncomingDeals] = useState<Deal[]>([]);
  const [salesHistory, setSalesHistory] = useState<Deal[]>([]);
  const [outgoingDeals, setOutgoingDeals] = useState<Deal[]>([]);
  const [dealActionId, setDealActionId] = useState<string | null>(null);

  // Редактирование профиля
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({ name: '', company: '' });

  const loadDeals = () => {
    if (!user) return;
    setIncomingDeals(getIncomingDeals(user.id));
    setSalesHistory(getSalesHistory(user.id));
    setOutgoingDeals(getOutgoingDeals(user.id));
  };

  const handleDealAction = (dealId: string, status: 'accepted' | 'rejected') => {
    setDealActionId(dealId);
    updateDealStatus(dealId, status);
    loadDeals();
    setDealActionId(null);
  };

  const loadListings = async () => {
    if (!user) return;
    setListingsLoading(true);
    const [rawRes, prodRes] = await Promise.all([
      supabase
        .from('raw_materials')
        .select('id, title, type, price_per_ton')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('products')
        .select('id, title, category, price, unit')
        .eq('manufacturer_id', user.id)
        .order('created_at', { ascending: false }),
    ]);
    setMyRaw(rawRes.data ?? []);
    setMyProducts(prodRes.data ?? []);
    setListingsLoading(false);
  };

  const loadRequests = async () => {
    if (!user) return;
    setRequestsLoading(true);
    try {
      const data = await fetchMyRecyclingRequests(user.id);
      setRequests(data);
    } catch (err) {
      console.error('loadRequests error:', err);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
    loadRequests();
    loadDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center text-muted">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteRaw = async (id: string, title: string) => {
    if (!confirm(`Удалить объявление «${title}»?`)) return;
    setDeleting(id);
    await supabase.from('raw_materials').delete().eq('id', id);
    await loadListings();
    setDeleting(null);
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Удалить объявление «${title}»?`)) return;
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    await loadListings();
    setDeleting(null);
  };

  const startEdit = () => {
    setForm({
      name: profile?.name ?? '',
      company: profile?.company ?? '',
    });
    setEditing(true);
    setSaveError('');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name.trim(),
          company: form.company.trim() || null,
        })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      setEditing(false);
    } catch (err: any) {
      setSaveError(err.message ?? 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  const totalRequests = requests.length;

  // Функция для красивого вывода роли
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'supplier': return 'Поставщик сырья';
      case 'producer': return 'Производитель';
      case 'buyer': return 'Покупатель';
      case 'collection_point': return 'Пункт приёма';
      case 'admin': return 'Администратор';
      default: return role;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* ---------- Профиль ---------- */}
      <Card hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
              {profile?.name || 'Пользователь'}
            </h1>
            <p className="text-sm text-muted mt-1">
              {getRoleLabel(profile?.role)}
              {profile?.company && ` · ${profile.company}`}
            </p>
            <p className="text-sm text-muted mt-0.5">{user.email}</p>
          </div>
          <div className="flex gap-2">
            {!editing && (
              <Button variant="outline" size="sm" onClick={startEdit}>
                Редактировать
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Выйти
            </Button>
          </div>
        </div>

        {editing && (
          <div className="mt-6 space-y-3 border-t border-line pt-5">
            <Input
              label="Имя"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Компания"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            {saveError && <p className="text-sm text-red-600">{saveError}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Сохраняем...' : 'Сохранить'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(false)}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ---------- Мои объявления ---------- */}
      <Card hover={false}>
        <div className="flex justify-between items-center mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-dark tracking-tight">
            Мои объявления{' '}
            {(myRaw.length + myProducts.length) > 0 && (
              <span className="text-muted font-medium">
                ({myRaw.length + myProducts.length})
              </span>
            )}
          </h2>
          <Link to="/add">
            <Button size="sm">+ Добавить</Button>
          </Link>
        </div>

        {listingsLoading ? (
          <p className="text-muted text-sm">Загрузка...</p>
        ) : myRaw.length === 0 && myProducts.length === 0 ? (
          <p className="text-sm text-muted">
            Пока нет объявлений.{' '}
            <Link to="/add" className="text-sage hover:underline">
              Создать первое
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {myRaw.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-btn border border-line p-4"
              >
                <Link to={`/product/${item.id}`} className="flex-1 min-w-0">
                  <Badge variant="sage">{RAW_MATERIAL_TYPES[item.type]}</Badge>
                  <p className="font-semibold text-dark mt-2 truncate">{item.title}</p>
                </Link>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="font-bold text-dark whitespace-nowrap">
                    {formatPricePer(item.price_per_ton, 'т')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/edit/raw/${item.id}`}
                      className="p-2 rounded-btn text-muted hover:text-sage hover:bg-sage-light transition-colors"
                      title="Редактировать"
                    >
                      <Pencil className="w-4 h-4" strokeWidth={2} />
                    </Link>
                    <button
                      onClick={() => handleDeleteRaw(item.id, item.title)}
                      disabled={deleting === item.id}
                      className="p-2 rounded-btn text-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {myProducts.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-btn border border-line p-4"
              >
                <Link to={`/product/${item.id}`} className="flex-1 min-w-0">
                  <Badge variant="olive">{PRODUCT_CATEGORIES[item.category]}</Badge>
                  <p className="font-semibold text-dark mt-2 truncate">{item.title}</p>
                </Link>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="font-bold text-dark whitespace-nowrap">
                    {formatPrice(item.price)} / {item.unit}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/edit/product/${item.id}`}
                      className="p-2 rounded-btn text-muted hover:text-sage hover:bg-sage-light transition-colors"
                      title="Редактировать"
                    >
                      <Pencil className="w-4 h-4" strokeWidth={2} />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(item.id, item.title)}
                      disabled={deleting === item.id}
                      className="p-2 rounded-btn text-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ---------- Входящие заявки на сделки ---------- */}
      <Card hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <Handshake className="w-5 h-5 text-sage" strokeWidth={2.2} />
          <h2 className="text-lg sm:text-xl font-bold text-dark tracking-tight">
            Входящие заявки{' '}
            {incomingDeals.filter((d) => d.status === 'pending').length > 0 && (
              <span className="text-muted font-medium">
                ({incomingDeals.filter((d) => d.status === 'pending').length})
              </span>
            )}
          </h2>
        </div>

        {incomingDeals.length === 0 ? (
          <p className="text-sm text-muted">
            Пока нет входящих заявок. Когда покупатель оставит заявку на ваше
            объявление — она появится здесь.
          </p>
        ) : (
          <div className="space-y-3">
            {incomingDeals.map((deal) => (
              <div
                key={deal.id}
                className="rounded-btn border border-line p-4 hover:border-sage transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge
                        variant={
                          deal.status === 'pending'
                            ? 'sage'
                            : deal.status === 'accepted'
                            ? 'olive'
                            : 'dark' // заменили 'muted' на 'dark'
                        }
                      >
                        {deal.status === 'pending'
                          ? 'Ожидает'
                          : deal.status === 'accepted'
                          ? 'Принята'
                          : deal.status === 'rejected'
                          ? 'Отклонена'
                          : deal.status}
                      </Badge>
                      <Badge variant="dark"> {/* заменили 'muted' на 'dark' */}
                        {deal.itemKind === 'raw' ? 'Сырьё' : 'Продукция'}
                      </Badge>
                    </div>
                    <p className="font-semibold text-dark truncate">
                      {deal.itemTitle}
                    </p>
                    <p className="text-sm text-text mt-1">
                      Покупатель: <span className="font-medium">{deal.buyerName}</span>
                      {deal.buyerEmail && (
                        <span className="text-muted"> · {deal.buyerEmail}</span>
                      )}
                    </p>
                    <p className="text-sm text-muted mt-0.5">
                      Объём: {deal.volume} {deal.itemKind === 'raw' ? 'т' : 'шт'} ·{' '}
                      {formatPrice(deal.totalPrice)} · {formatDate(deal.createdAt)}
                    </p>
                    {deal.message && (
                      <p className="text-sm text-text mt-2 bg-cream rounded-btn px-3 py-2">
                        «{deal.message}»
                      </p>
                    )}
                  </div>

                  {deal.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleDealAction(deal.id, 'accepted')}
                        disabled={dealActionId === deal.id}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Принять
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDealAction(deal.id, 'rejected')}
                        disabled={dealActionId === deal.id}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Отклонить
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ---------- История продаж ---------- */}
      <Card hover={false}>
        <h2 className="text-lg sm:text-xl font-bold text-dark tracking-tight mb-4">
          История продаж{' '}
          {salesHistory.length > 0 && (
            <span className="text-muted font-medium">({salesHistory.length})</span>
          )}
        </h2>

        {salesHistory.length === 0 ? (
          <p className="text-sm text-muted">
            Принятые и завершённые сделки появятся здесь. Это поможет отслеживать
            активность и экономику.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th className="pb-2 pr-3 font-medium">Товар</th>
                  <th className="pb-2 pr-3 font-medium">Покупатель</th>
                  <th className="pb-2 pr-3 font-medium">Объём</th>
                  <th className="pb-2 pr-3 font-medium">Сумма</th>
                  <th className="pb-2 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody>
                {salesHistory.map((deal) => (
                  <tr key={deal.id} className="border-b border-line/60">
                    <td className="py-2.5 pr-3 font-medium text-dark">
                      {deal.itemTitle}
                    </td>
                    <td className="py-2.5 pr-3 text-text">{deal.buyerName}</td>
                    <td className="py-2.5 pr-3 text-text">
                      {deal.volume} {deal.itemKind === 'raw' ? 'т' : 'шт'}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-dark">
                      {formatPrice(deal.totalPrice)}
                    </td>
                    <td className="py-2.5 text-muted">
                      {formatDate(deal.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ---------- Исходящие заявки покупателя ---------- */}
      {outgoingDeals.length > 0 && (
        <Card hover={false}>
          <h2 className="text-lg sm:text-xl font-bold text-dark tracking-tight mb-4">
            Мои исходящие заявки ({outgoingDeals.length})
          </h2>
          <div className="space-y-3">
            {outgoingDeals.map((deal) => (
              <div
                key={deal.id}
                className="rounded-btn border border-line p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-dark">{deal.itemTitle}</p>
                  <p className="text-sm text-muted">
                    {deal.volume} {deal.itemKind === 'raw' ? 'т' : 'шт'} ·{' '}
                    {formatPrice(deal.totalPrice)} · {formatDate(deal.createdAt)}
                  </p>
                </div>
                <Badge
                  variant={
                    deal.status === 'pending'
                      ? 'sage'
                      : deal.status === 'accepted'
                      ? 'olive'
                      : 'dark' // заменили 'muted' на 'dark'
                  }
                >
                  {deal.status === 'pending'
                    ? 'Ожидает ответа'
                    : deal.status === 'accepted'
                    ? 'Принята'
                    : deal.status === 'rejected'
                    ? 'Отклонена'
                    : deal.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ---------- Мои заявки на переработку ---------- */}
      <Card hover={false}>
        <div className="flex justify-between items-center mb-4 gap-3">
          <div className="flex items-center gap-2">
            <Recycle className="w-5 h-5 text-sage" strokeWidth={2.2} />
            <h2 className="text-lg sm:text-xl font-bold text-dark tracking-tight">
              Мои заявки на переработку{' '}
              {totalRequests > 0 && (
                <span className="text-muted font-medium">({totalRequests})</span>
              )}
            </h2>
          </div>
          <Link to="/recycling">
            <Button size="sm" variant="outline">
              Новая
            </Button>
          </Link>
        </div>

        {requestsLoading ? (
          <p className="text-muted text-sm">Загрузка заявок...</p>
        ) : totalRequests === 0 ? (
          <div>
            <p className="text-text mb-4">
              Пока заявок нет. Сдайте использованную продукцию или остатки сырья —
              они вернутся в производство или превратятся в компост.
            </p>
            <Link to="/recycling">
              <Button size="sm">Оставить заявку</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const isOpen = openRequestId === req.id;
              const itemLabel =
                req.sourceKind === 'raw'
                  ? req.rawType
                    ? RAW_MATERIAL_TYPES[req.rawType]
                    : 'Сырьё'
                  : req.category
                  ? PRODUCT_CATEGORIES[req.category]
                  : 'Продукция';

              return (
                <div
                  key={req.id}
                  className="rounded-btn border border-line hover:border-sage transition-all p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant="sage">
                          {req.sourceKind === 'raw' ? 'Сырьё' : 'Продукция'}
                        </Badge>
                        <Badge variant="olive">{itemLabel}</Badge>
                        <Badge variant={RECYCLING_STATUS_COLORS[req.status]}>
                          {RECYCLING_STATUSES[req.status]}
                        </Badge>
                      </div>
                      <p className="font-semibold text-dark truncate">
                        {req.pointName}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {req.volume} кг · {formatDate(req.createdAt)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpenRequestId(isOpen ? null : req.id)}
                    >
                      {isOpen ? 'Скрыть цикл' : 'Показать цикл'}
                    </Button>
                  </div>

                  {isOpen && (
                    <div className="mt-4">
                      <RecyclingCycle
                        status={req.status}
                        adminComment={req.adminComment}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};