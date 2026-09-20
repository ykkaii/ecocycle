import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ListingForm } from '../components/features/ListingForm';
import { useAuth } from '../context/AuthContext';

export const AddListingPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-dark mb-4 tracking-tight">
          Нужен аккаунт
        </h1>
        <p className="text-text mb-8">
          Чтобы разместить объявление, войдите или зарегистрируйтесь.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/login">
            <Button>Войти</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">Регистрация</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-dark mb-6 tracking-tight">
        Добавить объявление
      </h1>
      <ListingForm mode="create" initialKind="raw" />
    </div>
  );
};