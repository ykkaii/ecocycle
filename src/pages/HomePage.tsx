import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Factory, Sprout, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const HomePage = () => {
  const features = [
    {
      icon: Sprout,
      title: 'Сырьё от АПК',
      description: 'Рисовая солома, свекловичный жом, коровяк — напрямую от производителей.',
    },
    {
      icon: Factory,
      title: 'Производство',
      description: 'Отслеживание этапов изготовления биоразлагаемой продукции.',
    },
    {
      icon: Recycle,
      title: 'Замкнутый цикл',
      description: 'Сбор использованной продукции и повторная переработка.',
    },
    {
      icon: TrendingUp,
      title: 'Прозрачные сделки',
      description: 'Поиск партнёров, рейтинги, отзывы, история заказов.',
    },
  ];

  const stats = [
    { value: '20 000+', label: 'тонн соломы ежегодно' },
    { value: '3–6', label: 'месяцев до разложения' },
    { value: '7–8', label: 'деревьев спасено на тонну' },
    { value: '4', label: 'патента РФ' },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-sage-light text-sage-dark px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-sage"></span>
              Платформа замкнутого цикла
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold text-dark leading-[1.05] tracking-tightest mb-6">
              Отходы АПК — <br />
              в <span className="text-sage">полезные</span> продукты
            </h1>

            <p className="text-lg text-text mb-10 max-w-lg leading-relaxed">
              Соединяем производителей рисовой соломы, свекловичного жома и коровяка
              с переработчиками и покупателями биоразлагаемой продукции.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/catalog/raw">
                <Button size="lg">
                  Смотреть сырьё
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Button>
              </Link>
              <Link to="/catalog/products">
                <Button variant="outline" size="lg">
                  Каталог продукции
                </Button>
              </Link>
            </div>
          </div>

          {/* Сетка метрик */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`
                  bg-surface border border-line rounded-card p-6
                  ${i % 2 === 1 ? 'translate-y-6' : ''}
                  transition-all duration-300 hover:shadow-hover hover:-translate-y-1
                `}
              >
                <div className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-dark tracking-tightest mb-4">
            Как это работает
          </h2>
          <p className="text-lg text-text leading-relaxed">
            Четыре шага от сырья до готовой продукции и обратно в производство.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {features.map((feature, idx) => (
            <Card key={idx} className="!p-6">
              <div className="w-11 h-11 bg-sage-light rounded-xl flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5 text-sage-dark" strokeWidth={2.2} />
              </div>
              <h3 className="font-bold text-base text-dark mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-text leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative bg-dark rounded-[28px] p-12 md:p-20 text-center overflow-hidden">
          {/* декоративный градиент */}
          <div className="absolute inset-0 bg-gradient-to-br from-sage/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tightest mb-5 text-white">
              Присоединяйтесь к экосистеме
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Разместите сырьё или найдите партнёров для производства биоразлагаемой продукции.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-dark hover:bg-cream">
                Начать бесплатно
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};