import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Share2, Printer, MessageSquareText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleProperties } from '@/lib/sampleData';
import { sqmToPyeong, pricePerPyeong, formatPrice, maskAddress, getYoutubeEmbedUrl } from '@/lib/types';
import LoanCalculator from '@/components/LoanCalculator';
import ConsultationModal from '@/components/ConsultationModal';
import KakaoMap from '@/components/KakaoMap';

const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/your_id';
const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER || '031-123-4567';

const PropertyDetail = () => {
  const { id } = useParams();
  const property = sampleProperties.find((p) => p.id === id);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: property?.title,
      text: `[${property?.title}]\n금액: ${formatPrice(property?.price || 0)}\n면적: ${sqmToPyeong(property?.areaSqm || 0)}평\n\n자세한 정보는 아래 링크에서 확인하세요.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        console.log('공유 취소됨');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert('매물 정보와 링크가 클립보드에 복사되었습니다!');
    }
  };

  if (!property || property.status === 'hidden') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">매물을 찾을 수 없습니다</h2>
            <Link to="/properties" className="text-accent hover:underline">매물 목록으로 돌아가기</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pyeong = sqmToPyeong(property.areaSqm);
  const buildingPyeong = sqmToPyeong(property.buildingAreaSqm || 0);
  const totalFloorPyeong = sqmToPyeong(property.totalFloorAreaSqm || 0);
  const ppPyeong = pricePerPyeong(property.price, property.areaSqm);
  const maskedAddress = maskAddress(property.address); // 고객용 마스킹 주소
  const embedUrl = getYoutubeEmbedUrl(property.videoUrl || '');

  const infoRows = [
    { label: '매물유형', value: `${property.type} · ${property.dealType}` },
    { label: '가격', value: formatPrice(property.price) + (property.dealType === '임대' && property.monthlyRent ? ` / 월 ${formatPrice(property.monthlyRent)}` : '') },
    { label: '토지면적', value: `${property.areaSqm.toLocaleString()}㎡ (${pyeong}평)` },
    ...(property.buildingAreaSqm ? [{ label: '건축면적', value: `${property.buildingAreaSqm.toLocaleString()}㎡ (${buildingPyeong}평)` }] : []),
    ...(property.totalFloorAreaSqm ? [{ label: '연면적', value: `${property.totalFloorAreaSqm.toLocaleString()}㎡ (${totalFloorPyeong}평)` }] : []),
    { label: '평당가격', value: formatPrice(ppPyeong) },
    { label: '주소', value: maskedAddress }, // ← 마스킹 주소
    { label: '등록일', value: property.createdAt },
  ];

  const landRows = [
    { label: '지목', value: property.landCategory },
    { label: '용도지역', value: property.zoning },
    { label: '도로접면', value: property.roadFrontage || '-' },
    { label: '형상', value: property.shape || '-' },
    { label: '지세', value: property.terrain || '-' },
    ...(property.groundFloor ? [{ label: '층수', value: `지상 ${property.groundFloor}층${property.undergroundFloor ? ` / 지하 ${property.undergroundFloor}층` : ''}` }] : []),
    ...(property.structureName ? [{ label: '구조', value: property.structureName }] : []),
    ...(property.useApprovalDate ? [{ label: '사용승인일', value: property.useApprovalDate }] : []),
    { label: '위반건축물', value: property.illegalBuilding ? '⚠️ 해당' : '해당없음' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">

          <div className="flex items-center justify-between mb-6">
            <Link to="/properties" className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent text-sm">
              <ArrowLeft className="w-4 h-4" /> 매물 목록
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-1 text-xs"><Share2 className="w-3.5 h-3.5" /> 공유</Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1 text-xs"><Printer className="w-3.5 h-3.5" /> 인쇄</Button>
            </div>
          </div>

          {/* 미디어: 비디오 우선 */}
          {embedUrl ? (
            <div className="rounded-xl overflow-hidden mb-8 aspect-video bg-black">
              <iframe src={embedUrl} className="w-full h-full" allowFullScreen title={property.title} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden">
              <div className="h-64 md:h-80 gradient-navy flex items-center justify-center text-6xl">
                {property.type === '토지' ? '🌿' : property.type === '공장' ? '🏭' : '🏢'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(property.images.length > 0 ? property.images.slice(0, 4) : [1, 2, 3, 4]).map((img, i) => (
                  <div key={i} className="aspect-square bg-muted rounded overflow-hidden">
                    {typeof img === 'string' && img.startsWith('data') ? (
                      <img src={img} alt={`사진 ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">사진 {i + 1}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 제목 */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground">{property.type}</Badge>
              <Badge variant={property.dealType === '매매' ? 'default' : 'secondary'}>{property.dealType}</Badge>
              {property.status === 'sold' && <Badge className="bg-blue-500 text-white">거래완료</Badge>}
              {property.illegalBuilding && <Badge className="bg-destructive text-destructive-foreground">위반건축물</Badge>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{property.title}</h1>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
              <MapPin className="w-4 h-4" /> {maskedAddress}
            </div>
          </div>

          {/* 가격 */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="text-3xl font-bold text-accent">{formatPrice(property.price)}</div>
            {property.dealType === '임대' && property.monthlyRent && (
              <div className="text-muted-foreground mt-1">보증금 {formatPrice(property.price)} / 월세 {formatPrice(property.monthlyRent)}</div>
            )}
            <div className="text-muted-foreground text-sm mt-2">
              평당 {formatPrice(ppPyeong)} · 토지 {property.areaSqm.toLocaleString()}㎡ ({pyeong}평)
            </div>
          </div>

          {/* 문의 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#229ED9] text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm">
              <MessageSquareText className="w-5 h-5" />
              온라인 상담 문의 신청
            </button>
            <a href={`tel:${PHONE_NUMBER}`}
              className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-border text-foreground py-3.5 rounded-xl font-semibold hover:border-accent hover:text-accent transition-colors text-sm">
              <Phone className="w-4 h-4" /> {PHONE_NUMBER}
            </a>
          </div>

          {/* 기본정보 */}
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
            <h3 className="px-6 py-3 bg-muted font-semibold text-foreground">기본정보</h3>
            <div className="divide-y divide-border">
              {infoRows.map((row) => (
                <div key={row.label} className="flex px-6 py-3 text-sm">
                  <span className="w-24 shrink-0 text-muted-foreground font-medium">{row.label}</span>
                  <span className="text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 대출 계산기 */}
          <LoanCalculator price={property.price} />

          {/* 토지정보 */}
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
            <h3 className="px-6 py-3 bg-muted font-semibold text-foreground">토지정보</h3>
            <div className="divide-y divide-border">
              {landRows.map((row) => (
                <div key={row.label} className="flex px-6 py-3 text-sm">
                  <span className="w-24 shrink-0 text-muted-foreground font-medium">{row.label}</span>
                  <span className="text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 매물설명 */}
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
            <h3 className="px-6 py-3 bg-muted font-semibold text-foreground">매물 설명</h3>
            <div className="px-6 py-4 text-sm leading-relaxed text-foreground whitespace-pre-line">{property.description}</div>
          </div>

          {/* 위치 지도 — 시/구 레벨만 표시 (번지 보안) */}
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
            <div className="px-6 py-3 bg-muted flex items-center justify-between">
              <h3 className="font-semibold text-foreground">📍 대략 위치</h3>
              <span className="text-xs text-muted-foreground">정확한 위치는 문의 시 안내드립니다</span>
            </div>
            {/* 카카오맵 연동 */}
            <div className="relative w-full h-72 bg-muted">
              <KakaoMap address={property.address} />
            </div>
            <div className="px-6 py-3 flex items-center justify-between border-t border-border">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{maskedAddress}</span>
              </div>
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(property.address.replace(/\s+\d+.*$/, ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                카카오맵에서 보기 →
              </a>
            </div>
          </div>

          {/* 공인중개사법 의무사항 */}
          <div className="bg-muted/50 border border-border rounded-xl p-5 mb-6 text-sm">
            <h3 className="font-semibold text-foreground mb-3">⚖️ 중개사무소 정보 <span className="text-xs font-normal text-muted-foreground">(공인중개사법 제18조의2)</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {[
                { label: '사무소 명칭', value: property.agencyName || import.meta.env.VITE_AGENCY_NAME || 'px마을 부동산' },
                { label: '대표 공인중개사', value: property.agentName || import.meta.env.VITE_AGENT_NAME || '이영호' },
                { label: '등록번호', value: property.registrationNo || import.meta.env.VITE_REGISTRATION_NO || '제41480-2023-00017호' },
                { label: '사업자등록번호', value: '768-51-00786' },
                { label: '소재지', value: property.agencyAddress || import.meta.env.VITE_AGENCY_ADDRESS || '경기도 파주시 학령로105(아동동)' },
                { label: '연락처', value: property.agencyPhone || import.meta.env.VITE_PHONE_NUMBER || '031-123-4567' },
              ].map((row) => (
                <div key={row.label} className="flex gap-2">
                  <span className="text-muted-foreground w-28 shrink-0">{row.label}</span>
                  <span className="text-foreground font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 CTA */}
          <div className="bg-card border border-accent/30 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-1">이 매물이 마음에 드시나요?</h3>
            <p className="text-sm text-muted-foreground mb-4">전문 공인중개사가 빠르게 답변드립니다.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsConsultationOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm">
                💬 온라인 상담 문의 (빠른 접수)
              </button>
              <a href={`tel:${PHONE_NUMBER}`}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-border text-foreground py-3 rounded-lg font-semibold hover:border-accent hover:text-accent transition-colors text-sm">
                <Phone className="w-4 h-4" /> 전화 문의
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />

      {/* 상담 모달 */}
      {isConsultationOpen && (
        <ConsultationModal
          propertyId={property.id}
          propertyTitle={property.title}
          onClose={() => setIsConsultationOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
