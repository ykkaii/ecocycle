import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  // Показываем «окно» вокруг текущей страницы
  const pages: (number | '…')[] = [];
  const addPage = (p: number | '…') => pages.push(p);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) addPage(i);
  } else {
    addPage(1);
    if (currentPage > 3) addPage('…');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      addPage(i);
    }
    if (currentPage < totalPages - 2) addPage('…');
    addPage(totalPages);
  }

  const btn =
    'min-w-[38px] h-10 px-3 rounded-btn text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} text-text hover:bg-sage-light hover:text-sage-dark`}
        aria-label="Назад"
      >
        <ChevronLeft className="w-4 h-4 mx-auto" strokeWidth={2} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btn} ${
              p === currentPage
                ? 'bg-sage text-white shadow-soft'
                : 'text-text hover:bg-sage-light hover:text-sage-dark'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btn} text-text hover:bg-sage-light hover:text-sage-dark`}
        aria-label="Вперёд"
      >
        <ChevronRight className="w-4 h-4 mx-auto" strokeWidth={2} />
      </button>
    </div>
  );
};