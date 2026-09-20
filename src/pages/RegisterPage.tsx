import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'supplier' as 'supplier' | 'buyer',
    company: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Создаём пользователя в auth.users
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Не удалось создать пользователя');
      setLoading(false);
      return;
    }

    // 2. Создаём запись в profiles
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name: form.name,
      role: form.role,
      company: form.company || null,
      email: form.email,
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    // 3. ГЛАВНОЕ: перезагружаем профиль в контексте, чтобы имя появилось сразу
    await refreshProfile();

    // 4. Редирект
    navigate('/');
  };

  const selectClasses =
    'w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark text-sm focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all cursor-pointer';

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <Card hover={false}>
        <h1 className="text-3xl font-extrabold text-dark mb-2 text-center tracking-tight">
          Регистрация
        </h1>
        <p className="text-sm text-muted text-center mb-8">
          Создайте аккаунт, чтобы начать работу на платформе
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-btn px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Имя"
            type="text"
            placeholder="Иван Иванов"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="Минимум 6 символов"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">
              Роль
            </label>
            <select
              className={selectClasses}
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as 'supplier' | 'buyer' })
              }
            >
              <option value="supplier">Поставщик сырья</option>
              <option value="buyer">Покупатель</option>
            </select>
          </div>

          <Input
            label="Компания (необязательно)"
            type="text"
            placeholder='ООО "Пример"'
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <p className="text-center text-sm text-text mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-sage hover:text-sage-dark font-semibold">
            Войти
          </Link>
        </p>
      </Card>
    </div>
  );
};