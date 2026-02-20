import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Pencil, Trash2, Plus, LogOut, Search, Phone, StickyNote, CheckCircle, MessageSquareText } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { sampleProperties } from '@/lib/sampleData';
import { Property, sqmToPyeong, formatPrice, maskAddress } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  active: { label: '노출중', color: 'bg-green-500 text-white' },
  hidden: { label: '숨김', color: 'bg-gray-400 text-white' },
  sold: { label: '거래완료', color: 'bg-blue-500 text-white' },
};

const TYPE_COLOR: Record<string, string> = {
  '토지': 'bg-emerald-100 text-emerald-700',
  '공장': 'bg-blue-100 text-blue-700',
  '창고': 'bg-amber-100 text-amber-700',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [keyword, setKeyword] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [memoModal, setMemoModal] = useState<{ id: string; memo: string; ownerPhone: string } | null>(null);

  // 상담 내역
  const [activeTab, setActiveTab] = useState<'properties' | 'consultations'>('properties');
  const [consultations, setConsultations] = useState<any[]>([]);

  // 인증 및 데이터 로드
  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) {
      navigate('/admin');
    } else {
      const storedConsultations = JSON.parse(localStorage.getItem('px_consultations') || '[]');
      setConsultations(storedConsultations);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  // 숨김/노출 토글
  const toggleStatus = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = p.status === 'active' ? 'hidden' : 'active';
        toast({ title: `매물 ${next === 'active' ? '노출' : '숨김'} 처리되었습니다` });
        return { ...p, status: next };
      })
    );
  };

  // 거래완료 처리
  const markSold = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        toast({ title: '거래완료로 변경되었습니다' });
        return { ...p, status: 'sold' };
      })
    );
  };

  // 삭제
  const handleDelete = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    toast({ title: '매물이 삭제되었습니다', variant: 'destructive' });
    setDeleteId(null);
  };

  // 메모 저장
  const saveMemo = () => {
    if (!memoModal) return;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === memoModal.id ? { ...p, memo: memoModal.memo, ownerPhone: memoModal.ownerPhone } : p
      )
    );
    toast({ title: '메모가 저장되었습니다' });
    setMemoModal(null);
  };

  // 상담 상태 변경
  const toggleConsultationStatus = (id: string) => {
    setConsultations(prev => {
      const updated = prev.map(c =>
        c.id === id ? { ...c, status: c.status === 'pending' ? 'completed' : 'pending' } : c
      );
      localStorage.setItem('px_consultations', JSON.stringify(updated));
      toast({ title: '상담 상태가 변경되었습니다' });
      return updated;
    });
  };

  // 상담 내역 삭제
  const deleteConsultation = (id: string) => {
    if (confirm('상담 내역을 삭제하시겠습니까?')) {
      setConsultations(prev => {
        const updated = prev.filter(c => c.id !== id);
        localStorage.setItem('px_consultations', JSON.stringify(updated));
        toast({ title: '상담 내역이 삭제되었습니다' });
        return updated;
      });
    }
  };

  // 필터
  const filtered = properties.filter((p) => {
    if (keyword && !p.title.includes(keyword) && !p.address.includes(keyword)) return false;
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const counts = {
    total: properties.length,
    active: properties.filter((p) => p.status === 'active').length,
    hidden: properties.filter((p) => p.status === 'hidden').length,
    sold: properties.filter((p) => p.status === 'sold').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 관리자 전용 헤더 */}
      <div className="bg-primary px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-accent font-bold text-lg">🏢 관리자 대시보드</span>
          <Badge className="bg-amber-500 text-white text-xs">ADMIN</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground text-sm">← 사이트 보기</Link>
          <Button size="sm" variant="outline" onClick={handleLogout} className="gap-1 text-xs">
            <LogOut className="w-3.5 h-3.5" /> 로그아웃
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* 탭 전환 */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'properties' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            매물 관리
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-1 ${activeTab === 'consultations' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            상담 문의 내역 {consultations.filter(c => c.status === 'pending').length > 0 && (
              <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                {consultations.filter(c => c.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'properties' ? (
          <>
            {/* 통계 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: '전체', value: counts.total, color: 'text-foreground' },
                { label: '노출중', value: counts.active, color: 'text-green-600' },
                { label: '숨김', value: counts.hidden, color: 'text-gray-500' },
                { label: '거래완료', value: counts.sold, color: 'text-blue-600' },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 툴바 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="매물명, 주소 검색" className="pl-9" />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground">
                <option value="all">전체유형</option>
                <option value="토지">토지</option>
                <option value="공장">공장</option>
                <option value="창고">창고</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground">
                <option value="all">전체상태</option>
                <option value="active">노출중</option>
                <option value="hidden">숨김</option>
                <option value="sold">거래완료</option>
              </select>
              <Link to="/admin/register">
                <Button className="bg-accent text-accent-foreground gap-1 shrink-0">
                  <Plus className="w-4 h-4" /> 매물 등록
                </Button>
              </Link>
            </div>

            {/* 매물 목록 테이블 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">상태</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">유형</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-48">매물명</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">주소 (실제)</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">가격</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">면적</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">등록일</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">매물이 없습니다.</td></tr>
                    ) : filtered.map((p) => (
                      <tr key={p.id} className={`hover:bg-muted/40 transition-colors ${p.status === 'hidden' ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_LABEL[p.status ?? 'active']?.color ?? 'bg-green-500 text-white'}`}>
                            {STATUS_LABEL[p.status ?? 'active']?.label ?? '노출중'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLOR[p.type]}`}>
                            {p.type} {p.dealType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground line-clamp-1 max-w-48">{p.title}</div>
                          {p.memo && (
                            <div className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                              <StickyNote className="w-3 h-3" /> {p.memo.slice(0, 20)}{p.memo.length > 20 ? '...' : ''}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-foreground text-xs">{p.address}</div>
                          {p.ownerPhone && (
                            <div className="text-xs text-blue-600 mt-0.5 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {p.ownerPhone}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-accent font-medium whitespace-nowrap">
                          {formatPrice(p.price)}
                          {p.dealType === '임대' && p.monthlyRent && (
                            <div className="text-xs text-muted-foreground">월{formatPrice(p.monthlyRent)}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {sqmToPyeong(p.areaSqm)}평
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{p.createdAt}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {/* 숨김/노출 */}
                            <button
                              onClick={() => toggleStatus(p.id)}
                              title={p.status === 'active' ? '숨기기' : '노출하기'}
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                              {p.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            {/* 거래완료 */}
                            <button
                              onClick={() => markSold(p.id)}
                              title="거래완료"
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-blue-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            {/* 메모 */}
                            <button
                              onClick={() => setMemoModal({ id: p.id, memo: p.memo || '', ownerPhone: p.ownerPhone || '' })}
                              title="메모/소유자연락처"
                              className={`p-1.5 rounded hover:bg-muted transition-colors ${p.memo || p.ownerPhone ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
                            >
                              <StickyNote className="w-4 h-4" />
                            </button>
                            {/* 수정 */}
                            <Link
                              to={`/admin/register?edit=${p.id}`}
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-accent"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            {/* 삭제 */}
                            <button
                              onClick={() => setDeleteId(p.id)}
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">총 {filtered.length}건 / 전체 {properties.length}건</p>
          </>
        ) : (
          <>
            {/* 상담 목록 테이블 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">상태</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">고객명/연락처</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-48">문의 대상 매물</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-48">문의 내용</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">접수일시</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {consultations.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">접수된 상담 내역이 없습니다.</td></tr>
                    ) : consultations.map((c) => (
                      <tr key={c.id} className={`hover:bg-muted/40 transition-colors ${c.status === 'completed' ? 'opacity-60 bg-muted/20' : ''}`}>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-gray-500 text-white'}`}>
                            {c.status === 'pending' ? '답변대기' : '상담완료'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{c.customerName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {c.customerPhone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/properties/${c.propertyId}`} target="_blank" className="font-medium text-blue-600 hover:underline line-clamp-1">{c.propertyTitle}</Link>
                        </td>
                        <td className="px-4 py-3 flex-1">
                          <div className="text-foreground text-sm line-clamp-3 whitespace-pre-wrap">{c.message || '-'}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleConsultationStatus(c.id)}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${c.status === 'pending' ? 'bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-white border' : 'bg-background border-border border text-foreground hover:bg-muted'}`}
                            >
                              {c.status === 'pending' ? '완료처리' : '대기복구'}
                            </button>
                            <button
                              onClick={() => deleteConsultation(c.id)}
                              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors title='삭제'"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">총 {consultations.length}건 / 대기 {consultations.filter(c => c.status === 'pending').length}건</p>
          </>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-foreground text-lg mb-2">매물 삭제</h3>
            <p className="text-muted-foreground text-sm mb-6">이 매물을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>취소</Button>
              <Button className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDelete(deleteId)}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 메모/소유자연락처 모달 */}
      {memoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-foreground text-lg">🔒 관리자 전용 메모</h3>
            <p className="text-xs text-muted-foreground">이 정보는 고객에게 노출되지 않습니다.</p>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">소유자 전화번호</label>
              <Input
                value={memoModal.ownerPhone}
                onChange={(e) => setMemoModal({ ...memoModal, ownerPhone: e.target.value })}
                placeholder="예: 010-1234-5678"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">메모</label>
              <textarea
                value={memoModal.memo}
                onChange={(e) => setMemoModal({ ...memoModal, memo: e.target.value })}
                placeholder="내부 메모 (가격 협의 여부, 특이사항 등)"
                rows={4}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setMemoModal(null)}>취소</Button>
              <Button className="flex-1 bg-accent text-accent-foreground" onClick={saveMemo}>저장</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
