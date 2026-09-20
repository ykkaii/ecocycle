import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ListingForm } from '../components/features/ListingForm';
import { fetchRawMaterialById, fetchProductById } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { RawMaterial, Product } from '../types';

export const EditListingPage = () => {
  const { kind, id } = useParams<{ kind: string; id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RawMaterial | Product | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !kind) return;
    const load = async () => {
      try {
        const item =
          kind === 'raw'
            ? await fetchRawMaterialById(id)
            : await fetchProductById(id);
        setData(item);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, kind]);

  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center text-muted">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-4 tracking-tight">
          Объявление не найдено
        </h1>
        <Link to="/profile">
          <Button variant="outline">В личный кабинет</Button>
        </Link>
      </div>
    );
  }

  const ownerId = 'type' in data ? data.sellerId : data.manufacturerId;
  if (ownerId !== user.id) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-4 tracking-tight">
          Нет доступа
        </h1>
        <p className="text-text mb-8">Вы можете редактировать только свои объявления.</p>
        <Link to="/profile">
          <Button variant="outline">В личный кабинет</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-5 md:mb-6 tracking-tight">
        Редактирование объявления
      </h1>
      <ListingForm mode="edit" initialData={data} />
    </div>
  );
};