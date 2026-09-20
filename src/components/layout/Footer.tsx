import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-16 md:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div>
          <h3 className="text-lg font-extrabold mb-3 text-white tracking-tight">
            ЭкоЦикл
          </h3>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            Платформа замкнутого цикла переработки отходов АПК в биоразлагаемую продукцию.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wider">
            Разделы
          </h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li>
              <Link
                to="/catalog/raw"
                className="hover:text-white transition-colors"
              >
                Каталог сырья
              </Link>
            </li>
            <li>
              <Link
                to="/catalog/products"
                className="hover:text-white transition-colors"
              >
                Каталог продукции
              </Link>
            </li>
            <li>
              <Link
                to="/recycling"
                className="hover:text-white transition-colors"
              >
                Переработка
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wider">
            Контакты
          </h4>
          <p className="text-sm text-white/60 leading-relaxed">
            КубГАУ, Краснодар
            <br />
            <a
              href="mailto:sampetova05@mail.ru"
              className="hover:text-white transition-colors"
            >
              sampetova05@mail.ru
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40 px-4">
        © 2026 ЭкоЦикл. MVP-версия.
      </div>
    </footer>
  );
};