import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.message === 'Invalid login credentials'
          ? 'Неверный email или пароль'
          : signInError.message
      );
      setLoading(false);
      return;
    }

    // Успешный вход — переходим на главную
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <Card hover={false}>
        <h1 className="text-3xl font-extrabold text-dark mb-2 text-center tracking-tight">
          Вход
        </h1>
        <p className="text-sm text-muted text-center mb-8">
          Войдите, чтобы размещать объявления и связываться с партнёрами
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-btn px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </Button>
        </form>

        <p className="text-center text-sm text-text mt-6">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-sage hover:text-sage-dark font-semibold">
            Зарегистрироваться
          </Link>
        </p>
      </Card>
    </div>
  );
};