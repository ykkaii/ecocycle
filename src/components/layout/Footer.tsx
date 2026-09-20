export const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
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
            <li className="hover:text-white transition-colors cursor-pointer">Каталог сырья</li>
            <li className="hover:text-white transition-colors cursor-pointer">Каталог продукции</li>
            <li className="hover:text-white transition-colors cursor-pointer">Переработка</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-white/80 uppercase tracking-wider">
            Контакты
          </h4>
          <p className="text-sm text-white/60 leading-relaxed">
            КубГАУ, Краснодар
            <br />
            ecocycle@example.com
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © 2026 ЭкоЦикл. MVP-версия.
      </div>
    </footer>
  );
};