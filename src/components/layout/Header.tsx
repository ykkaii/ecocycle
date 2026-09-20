import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, User, PlusCircle, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/catalog/raw', label: 'Сырьё' },
    { to: '/catalog/products', label: 'Продукция' },
    { to: '/recycling', label: 'Переработка' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={closeMenu}>
          <div className="bg-sage p-2 rounded-xl group-hover:bg-sage-dark transition-colors">
            <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold text-dark tracking-tight">
            ЭкоЦикл
          </span>
        </Link>

        {/* Навигация — desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
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

        {/* Действия — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link to="/add">
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
              <Link to="/add">
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

        {/* Кнопка меню — mobile */}
        <button
          className="md:hidden p-2 rounded-btn text-dark hover:bg-cream transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {menuOpen ? (
            <X className="w-6 h-6" strokeWidth={2} />
          ) : (
            <Menu className="w-6 h-6" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Выпадающее меню — mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-line bg-white">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={`
                  block px-4 py-3 rounded-btn text-base font-medium transition-colors
                  ${location.pathname === link.to
                    ? 'bg-sage-light text-sage-dark'
                    : 'text-text hover:bg-cream'}
                `}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-line space-y-2">
              {user ? (
                <>
                  <Link to="/add" onClick={closeMenu}>
                    <Button variant="outline" size="md" fullWidth>
                      <PlusCircle className="w-4 h-4" strokeWidth={2} />
                      Разместить
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={closeMenu}>
                    <Button variant="primary" size="md" fullWidth>
                      <User className="w-4 h-4" strokeWidth={2} />
                      {profile?.name?.split(' ')[0] ?? 'Профиль'}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="md" fullWidth onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/add" onClick={closeMenu}>
                    <Button variant="outline" size="md" fullWidth>
                      <PlusCircle className="w-4 h-4" strokeWidth={2} />
                      Разместить
                    </Button>
                  </Link>
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="primary" size="md" fullWidth>
                      <User className="w-4 h-4" strokeWidth={2} />
                      Войти
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};