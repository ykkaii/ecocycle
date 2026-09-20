import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { RawMaterial, Product } from '../../types';

interface Props {
  mode: 'create' | 'edit';
  initialKind?: 'raw' | 'product';
  initialData?: RawMaterial | Product;
}

export const ListingForm = ({ mode, initialKind = 'raw', initialData }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEdit = mode === 'edit';

  // Определяем вид: при редактировании смотрим на поля объекта
  const [kind, setKind] = useState<'raw' | 'product'>(() => {
    if (isEdit && initialData) return 'type' in initialData ? 'raw' : 'product';
    return initialKind;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState(() => {
    if (isEdit && initialData) {
      if ('type' in initialData) {
        // RawMaterial
        return {
          title: initialData.title,
          description: initialData.description,
          price: String(initialData.pricePerTon),
          volume: String(initialData.volume),
          location: initialData.location,
          type: initialData.type,
          category: 'tableware',
          unit: 'шт',
          biodegradableMonths: '',
          imageUrl: initialData.imageUrl ?? '',
        };
      } else {
        // Product
        return {
          title: initialData.title,
          description: initialData.description,
          price: String(initialData.price),
          volume: '',
          location: initialData.location ?? '',
          type: 'rice_straw',
          category: initialData.category,
          unit: initialData.unit,
          biodegradableMonths: String(initialData.biodegradableMonths),
          imageUrl: initialData.imageUrl ?? '',
        };
      }
    }
    return {
      title: '',
      description: '',
      price: '',
      volume: '',
      location: '',
      type: 'rice_straw',
      category: 'tableware',
      unit: 'шт',
      biodegradableMonths: '',
      imageUrl: '',
    };
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (kind === 'raw') {
      const payload = {
        title: form.title,
        description: form.description,
        price_per_ton: Number(form.price),
        volume: Number(form.volume),
        location: form.location,
        type: form.type,
        image_url: form.imageUrl || null,
      };

      const { error: err } = isEdit
        ? await supabase.from('raw_materials').update(payload).eq('id', initialData!.id)
        : await supabase.from('raw_materials').insert({ ...payload, seller_id: user.id });

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    } else {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        unit: form.unit,
        category: form.category,
        location: form.location || null,
        biodegradable_months: Number(form.biodegradableMonths),
        image_url: form.imageUrl || null,
      };

      const { error: err } = isEdit
        ? await supabase.from('products').update(payload).eq('id', initialData!.id)
        : await supabase.from('products').insert({ ...payload, manufacturer_id: user.id });

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }

    navigate('/profile');
  };

  const selectClasses =
    'w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark text-sm focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all cursor-pointer';

  return (
    <Card hover={false}>
      {!isEdit ? (
        <div className="flex gap-2 mb-6 p-1 bg-cream rounded-btn">
          <button
            type="button"
            onClick={() => setKind('raw')}
            className={`flex-1 py-2 rounded-btn text-sm font-semibold transition-all ${
              kind === 'raw' ? 'bg-white text-dark shadow-soft' : 'text-text'
            }`}
          >
            Сырьё
          </button>
          <button
            type="button"
            onClick={() => setKind('product')}
            className={`flex-1 py-2 rounded-btn text-sm font-semibold transition-all ${
              kind === 'product' ? 'bg-white text-dark shadow-soft' : 'text-text'
            }`}
          >
            Продукция
          </button>
        </div>
      ) : (
        <div className="mb-6 pb-4 border-b border-line">
          <span className="text-sm text-muted">
            Тип объявления:{' '}
            <span className="font-semibold text-dark">
              {kind === 'raw' ? 'Сырьё' : 'Продукция'}
            </span>
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-btn px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Название"
          placeholder={kind === 'raw' ? 'Рисовая солома, тюки' : 'Кассета для рассады'}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Описание</label>
          <textarea
            className="w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark text-sm focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all"
            rows={3}
            placeholder="Расскажите подробнее о сырье или продукции"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <Input
          label="Ссылка на фото (необязательно)"
          type="url"
          placeholder="https://..."
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        {kind === 'raw' ? (
          <>
            <Input
              label="Цена за тонну (₽)"
              type="number"
              placeholder="2500"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min={0}
            />
            <Input
              label="Объём (тонн)"
              type="number"
              placeholder="500"
              value={form.volume}
              onChange={(e) => setForm({ ...form, volume: e.target.value })}
              required
              min={0}
            />
            <Input
              label="Местоположение"
              placeholder="Краснодарский край, Славянский р-н"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Тип сырья
              </label>
              <select
                className={selectClasses}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="rice_straw">Рисовая солома</option>
                <option value="beet_pulp">Свекловичный жом</option>
                <option value="manure">Коровяк</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <Input
              label="Цена (₽)"
              type="number"
              placeholder="45"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min={0}
            />
            <Input
              label="Единица измерения"
              placeholder="шт, кг, упак"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Категория
              </label>
              <select
                className={selectClasses}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="tableware">Посуда</option>
                <option value="pots">Горшки</option>
                <option value="cassettes">Кассеты</option>
                <option value="trays">Лотки</option>
              </select>
            </div>
            <Input
              label="Срок разложения (мес.)"
              type="number"
              placeholder="6"
              value={form.biodegradableMonths}
              onChange={(e) => setForm({ ...form, biodegradableMonths: e.target.value })}
              required
              min={1}
            />
            <Input
              label="Местоположение (необязательно)"
              placeholder="Краснодарский край"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </>
        )}

        <Button type="submit" fullWidth disabled={loading} size="lg">
          {loading
            ? isEdit
              ? 'Сохраняем...'
              : 'Публикуем...'
            : isEdit
            ? 'Сохранить изменения'
            : 'Опубликовать'}
        </Button>
      </form>
    </Card>
  );
};