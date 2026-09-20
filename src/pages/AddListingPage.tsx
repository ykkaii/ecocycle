import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ListingForm } from '../components/features/ListingForm';
import { useAuth } from '../context/AuthContext';

export const AddListingPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-4 tracking-tight">
          Нужен аккаунт
        </h1>
        <p className="text-text mb-8">
          Чтобы разместить объявление, войдите или зарегистрируйтесь.
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
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-5 md:mb-6 tracking-tight">
        Добавить объявление
      </h1>
      <ListingForm mode="create" initialKind="raw" />
    </div>
  );
};