import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice, formatPricePer } from '../utils/format';
import { RAW_MATERIAL_TYPES, PRODUCT_CATEGORIES } from '../utils/constants';

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

  // Список объявлений
  const [myRaw, setMyRaw] = useState<MyRaw[]>([]);
  const [myProducts, setMyProducts] = useState<MyProduct[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Режим редактирования профиля
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

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center text-muted">
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">
          Личный кабинет
        </h1>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Выйти
        </Button>
      </div>

      {/* ---------- Карточка профиля (единая) ---------- */}
      <Card hover={false} className="mb-6">
        {!editing ? (
          // Режим просмотра
          <>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-dark tracking-tight">Профиль</h2>
              <Button variant="ghost" size="sm" onClick={startEditing}>
                Редактировать
              </Button>
            </div>
            <div className="space-y-2 text-text">
              <p>
                <span className="text-muted">Имя: </span>
                <span className="font-medium text-dark">{profile?.name || '—'}</span>
              </p>
              <p>
                <span className="text-muted">Email: </span>
                <span className="font-medium text-dark">{user.email}</span>
              </p>
              <p>
                <span className="text-muted">Роль: </span>
                <span className="font-medium text-dark">
                  {profile?.role === 'supplier' ? 'Поставщик сырья' : 'Покупатель'}
                </span>
              </p>
              <p>
                <span className="text-muted">Компания: </span>
                <span className="font-medium text-dark">{profile?.company || '—'}</span>
              </p>
            </div>
            <p className="text-xs text-muted mt-4">
              Email и роль изменить нельзя. Если нужно — создайте новый аккаунт.
            </p>
          </>
        ) : (
          // Режим редактирования
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

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Сохраняем...' : 'Сохранить'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>

      {/* ---------- Карточка с объявлениями ---------- */}
      <Card hover={false}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-dark tracking-tight">
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
                className="flex items-center justify-between gap-3 p-4 rounded-btn border border-line hover:border-sage transition-all"
              >
                <Link to={`/product/${item.id}`} className="flex-1 min-w-0">
                  <Badge variant="sage">{RAW_MATERIAL_TYPES[item.type]}</Badge>
                  <p className="font-semibold text-dark mt-2 truncate">{item.title}</p>
                </Link>
                <Link
                  to={`/edit/raw/${item.id}`}
                  className="p-2 rounded-btn text-muted hover:text-sage hover:bg-sage-light transition-colors"
                  title="Редактировать"
                >
                  <Pencil className="w-4 h-4" strokeWidth={2} />
                </Link>
                <span className="font-bold text-dark whitespace-nowrap">
                  {formatPricePer(item.price_per_ton, 'т')}
                </span>
                <button
                  onClick={() => handleDeleteRaw(item.id, item.title)}
                  disabled={deleting === item.id}
                  className="p-2 rounded-btn text-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            ))}

            {myProducts.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-4 rounded-btn border border-line hover:border-sage transition-all"
              >
                <Link to={`/product/${item.id}`} className="flex-1 min-w-0">
                  <Badge variant="olive">{PRODUCT_CATEGORIES[item.category]}</Badge>
                  <p className="font-semibold text-dark mt-2 truncate">{item.title}</p>
                </Link>
                <span className="font-bold text-dark whitespace-nowrap">
                  {formatPrice(item.price)} / {item.unit}
                </span>
                <button
                  onClick={() => handleDeleteProduct(item.id, item.title)}
                  disabled={deleting === item.id}
                  className="p-2 rounded-btn text-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};