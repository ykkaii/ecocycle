import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  fetchAllRecyclingRequests,
  updateRecyclingRequestStatus,
} from '../lib/api';
import {
  PRODUCT_CATEGORIES,
  RAW_MATERIAL_TYPES,
  RECYCLING_STATUSES,
} from '../utils/constants';
import { formatDate } from '../utils/format';
import type { RecyclingRequest, RecyclingStatus } from '../types';

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | RecyclingStatus>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setRequests(await fetchAllRecyclingRequests());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    load();
  }, [profile]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Shield className="w-12 h-12 mx-auto text-muted mb-4" strokeWidth={1.5} />
        <h1 className="text-2xl font-extrabold text-dark mb-3">
          Доступ только для админа
        </h1>
        <p className="text-text mb-8">
          У вашего аккаунта нет прав для просмотра этой страницы.
        </p>
        <Link to="/">
          <Button variant="outline">На главную</Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (
    id: string,
    status: RecyclingStatus
  ) => {
    setUpdatingId(id);
    try {
      await updateRecyclingRequestStatus(
        id,
        status,
        status === 'rejected' ? adminComment : undefined
      );
      await load();
      setAdminComment('');
      setOpenId(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered =
    statusFilter === ''
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const counts = {
    pending: requests.filter((r) => r.status === 'pending').length,
    in_progress: requests.filter((r) => r.status === 'in_progress').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  const selectClasses =
    'w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark text-sm focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all cursor-pointer';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-11 h-11 bg-sage-light rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-sage-dark" strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
            Админ-панель
          </h1>
          <p className="text-sm text-muted">Управление заявками на переработку</p>
        </div>
      </div>

      {/* Счётчики */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          { label: 'Ожидают', value: counts.pending, icon: Clock },
          { label: 'В работе', value: counts.in_progress, icon: Loader2 },
          { label: 'Завершены', value: counts.completed, icon: CheckCircle2 },
        ].map((c, i) => (
          <Card key={i} className="!p-4 md:!p-5">
            <c.icon className="w-4 h-4 text-olive mb-2" strokeWidth={2} />
            <div className="text-2xl md:text-3xl font-extrabold text-dark tracking-tight">
              {c.value}
            </div>
            <div className="text-xs text-muted mt-1">{c.label}</div>
          </Card>
        ))}
      </div>

      {/* Фильтр */}
      <div className="bg-surface border border-line rounded-card p-3 sm:p-4 mb-6">
        <select
          className={selectClasses}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | RecyclingStatus)}
        >
          <option value="">Все заявки ({requests.length})</option>
          {Object.entries(RECYCLING_STATUSES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-muted">Загрузка заявок...</p>}
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-btn px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-center text-muted py-10">Заявок нет</p>
      )}

      <div className="space-y-3">
        {filtered.map((req) => {
          const isOpen = openId === req.id;
          return (
            <Card key={req.id} className="!p-4 md:!p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="sage">
                      {req.sourceKind === 'raw' ? 'Сырьё' : 'Продукция'}
                    </Badge>
                    {req.category && (
                      <Badge variant="olive">
                        {PRODUCT_CATEGORIES[req.category]}
                      </Badge>
                    )}
                    {req.rawType && (
                      <Badge variant="olive">
                        {RAW_MATERIAL_TYPES[req.rawType]}
                      </Badge>
                    )}
                    <Badge variant="lime">
                      {RECYCLING_STATUSES[req.status]}
                    </Badge>
                  </div>
                  <p className="font-semibold text-dark truncate">
                    {req.userName} → {req.pointName}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {req.volume} кг · {formatDate(req.createdAt)} · {req.userEmail}
                  </p>
                  {req.comment && (
                    <p className="text-sm text-text mt-2 leading-relaxed">
                      «{req.comment}»
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenId(isOpen ? null : req.id)}
                >
                  {isOpen ? 'Скрыть' : 'Управлять'}
                </Button>
              </div>

              {isOpen && (
                <div className="mt-5 pt-5 border-t border-line space-y-3">
                  <div className="text-sm text-muted mb-3">
                    Изменить статус:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'accepted', 'in_progress', 'completed'] as RecyclingStatus[]).map(
                      (s) => (
                        <Button
                          key={s}
                          variant={req.status === s ? 'primary' : 'outline'}
                          size="sm"
                          disabled={updatingId === req.id || req.status === s}
                          onClick={() => handleStatusChange(req.id, s)}
                        >
                          {RECYCLING_STATUSES[s]}
                        </Button>
                      )
                    )}
                  </div>

                  <div className="pt-3 border-t border-line">
                    <label className="block text-sm text-muted mb-2">
                      Комментарий при отклонении (необязательно):
                    </label>
                    <textarea
                      className="w-full px-4 py-2.5 rounded-btn border border-line bg-white text-dark text-sm focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all"
                      rows={2}
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="Укажите причину отказа"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 !text-red-600 !border-red-200 hover:!bg-red-50"
                      disabled={updatingId === req.id}
                      onClick={() => handleStatusChange(req.id, 'rejected')}
                    >
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                      Отклонить заявку
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};