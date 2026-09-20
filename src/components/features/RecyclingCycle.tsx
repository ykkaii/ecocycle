import { Check, X, Circle, Loader2 } from 'lucide-react';
import { RECYCLING_CYCLE, cycleIndex } from '../../utils/constants';
import type { RecyclingStatus } from '../../types';

interface Props {
  status: RecyclingStatus;
  adminComment?: string | null;
}

export const RecyclingCycle = ({ status, adminComment }: Props) => {
  const currentIdx = cycleIndex(status);

  // Отклонённая заявка — отдельный вид
  if (status === 'rejected') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-card p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <X className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-semibold text-red-900">Заявка отклонена</div>
            {adminComment && (
              <p className="text-sm text-red-700 mt-2 leading-relaxed">
                {adminComment}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-line rounded-card p-5 md:p-6">
      <div className="space-y-5">
        {RECYCLING_CYCLE.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isFuture = idx > currentIdx;

          return (
            <div key={step.key} className="flex items-start gap-3 relative">
              {/* Соединительная линия */}
              {idx < RECYCLING_CYCLE.length - 1 && (
                <div
                  className={`
                    absolute left-[17px] top-9 w-0.5 h-[calc(100%-4px)]
                    ${isDone ? 'bg-sage' : 'bg-line'}
                  `}
                />
              )}

              {/* Иконка статуса */}
              <div
                className={`
                  relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${isDone ? 'bg-sage text-white' : ''}
                  ${isCurrent ? 'bg-sage-light text-sage-dark ring-4 ring-sage/20' : ''}
                  ${isFuture ? 'bg-cream text-muted border border-line' : ''}
                `}
              >
                {isDone && <Check className="w-5 h-5" strokeWidth={2.5} />}
                {isCurrent && (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                )}
                {isFuture && <Circle className="w-4 h-4" strokeWidth={2} />}
              </div>

              {/* Текст */}
              <div className="pt-1.5">
                <div
                  className={`
                    font-semibold text-sm
                    ${isDone || isCurrent ? 'text-dark' : 'text-muted'}
                  `}
                >
                  {step.label}
                </div>
                <div
                  className={`
                    text-xs mt-1 leading-relaxed
                    ${isDone || isCurrent ? 'text-text' : 'text-muted'}
                  `}
                >
                  {step.description}
                </div>

                {isCurrent && adminComment && step.key === status && (
                  <div className="mt-2 text-xs bg-sage-light text-sage-dark rounded-btn px-3 py-2">
                    <span className="font-semibold">Комментарий пункта:</span>{' '}
                    {adminComment}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};