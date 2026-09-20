import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Pencil, Recycle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RecyclingCycle } from '../components/features/RecyclingCycle';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { fetchMyRecyclingRequests } from '../lib/api';
import { formatPrice, formatPricePer, formatDate } from '../utils/format';
import {
  RAW_MATERIAL_TYPES,
  PRODUCT_CATEGORIES,
  RECYCLING_STATUSES,
  RECYCLING_STATUS_COLORS,
} from '../utils/constants';
import type { RecyclingRequest } from '../types';

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

  // Редактирование профиля
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({ name: '', company: '' });

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

  /* ---------- Редактирование профиля ---------- */

  const startEditing = () => {
    setForm({
      name: profile?.name ?? '',
      company: profile?.company ?? '',
    });
    setSaveError('');
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setSaveError('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name.trim(),
        company: form.company.trim() || null,
      })
      .eq('id', user.id);

    if (error) {
      setSaveError(error.message);
      setSaving(false);
      return;
    }

    await refreshProfile();
    setEditing(false);
    setSaving(false);
  };

  /* ---------- Удаление объявлений ---------- */

  const handleDeleteRaw = async (id: string, title: string) => {
    if (!window.confirm(`Удалить объявление «${title}»? Действие нельзя отменить.`)) return;
    setDeleting(id);
    const { error } = await supabase.from('raw_materials').delete().eq('id', id);
    if (error) {
      alert(error.message);
    } else {
      setMyRaw((prev) => prev.filter((item) => item.id !== id));
    }
    setDeleting(null);
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`Удалить объявление «${title}»? Действие нельзя отменить.`)) return;
    setDeleting(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert(error.message);
    } else {
      setMyProducts((prev) => prev.filter((item) => item.id !== id));
    }
    setDeleting(null);
  };

  const totalListings = myRaw.length + myProducts.length;
  const totalRequests = requests.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <div className="flex justify-between items-center mb-6 md:mb-8 gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
          Личный кабинет
        </h1>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Выйти
        </Button>
      </div>

      {/* ---------- Карточка профиля ---------- */}
      <Card hover={false} className="mb-6">
        {!editing ? (
          <>
            <div className="flex justify-between items-start mb-4 gap-3">
              <h2 className="text-xl font-bold text-dark tracking-tight">Профиль</h2>
              <Button variant="ghost" size="sm" onClick={startEditing}>
                Редактировать
              </Button>
            </div>
            <div className="space-y-2 text-sm sm:text-base text-text">
              <p>
                <span className="text-muted">Имя: </span>
                <span className="font-medium text-dark">{profile?.name || '—'}</span>
              </p>
              <p className="break-all">
                <span className="text-muted">Email: </span>
                <span className="font-medium text-dark">{user.email}</span>
              </p>
              <p>
                <span className="text-muted">Роль: </span>
                <span className="font-medium text-dark">
                  {profile?.role === 'admin'
                    ? 'Администратор'
                    : profile?.role === 'supplier'
                    ? 'Поставщик сырья'
                    : 'Покупатель'}
                </span>
              </p>
              <p>
                <span className="text-muted">Компания: </span>
                <span className="font-medium text-dark">{profile?.company || '—'}</span>
              </p>
            </div>
            {profile?.role !== 'admin' && (
              <p className="text-xs text-muted mt-4">
                Email и роль изменить нельзя. Если нужно — создайте новый аккаунт.
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-dark tracking-tight mb-5">
              Редактирование профиля
            </h2>

            {saveError && (
              <div className="bg-red-50 text-red-700 text-sm rounded-btn px-4 py-3 mb-5">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Имя"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Компания"
                type="text"
                placeholder='ООО "Пример"'
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? 'Сохраняем...' : 'Сохранить'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>

      {/* ---------- Мои объявления ---------- */}
      <Card hover={false} className="mb-6">
        <div className="flex justify-between items-center mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-dark tracking-tight">
            Мои объявления{' '}
            {totalListings > 0 && (
              <span className="text-muted font-medium">({totalListings})</span>
            )}
          </h2>
          <Link to="/add">
            <Button size="sm">Добавить</Button>
          </Link>
        </div>

        {listingsLoading ? (
          <p className="text-muted text-sm">Загрузка объявлений...</p>
        ) : totalListings === 0 ? (
          <p className="text-text">
            Пока объявлений нет. Добавьте первое — и оно появится в каталоге.
          </p>
        ) : (
          <div className="space-y-3">
            {myRaw.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-btn border border-line hover:border-sage transition-all"
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
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-btn border border-line hover:border-sage transition-all"
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
              <Button variant="outline" size="sm">
                Оставить заявку
              </Button>
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