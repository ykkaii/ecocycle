import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, User, PlusCircle, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/catalog/raw', label: 'Сырьё' },
    { to: '/catalog/products', label: 'Продукция' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-sage p-2 rounded-xl group-hover:bg-sage-dark transition-colors">
            <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold text-dark tracking-tight">
            ЭкоЦикл
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`
                px-3.5 py-2 rounded-btn text-sm font-medium transition-colors
                ${location.pathname === link.to
                  ? 'bg-sage-light text-sage-dark'
                  : 'text-text hover:text-dark hover:bg-cream'}
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/add" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <PlusCircle className="w-4 h-4" strokeWidth={2} />
                  Разместить
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" strokeWidth={2} />
                  {profile?.name?.split(' ')[0] ?? 'Профиль'}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" strokeWidth={2} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/add" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <PlusCircle className="w-4 h-4" strokeWidth={2} />
                  Разместить
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="sm">
                  <User className="w-4 h-4" strokeWidth={2} />
                  Войти
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};