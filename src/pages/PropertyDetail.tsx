import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { sampleProperties } from '@/lib/sampleData';
import { sqmToPyeong, pricePerPyeong, formatPrice } from '@/lib/types';

const PropertyDetail = () => {
  const { id } = useParams();
  const property = sampleProperties.find((p) => p.id === id);

  if (!property) {
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
  const ppPyeong = pricePerPyeong(property.price, property.areaSqm);

  const infoRows = [
    { label: '매물유형', value: property.type },
    { label: '거래유형', value: property.dealType },
    { label: '가격', value: formatPrice(property.price) + (property.dealType === '임대' && property.monthlyRent ? ` / 월 ${formatPrice(property.monthlyRent)}` : '') },
    { label: '면적', value: `${property.areaSqm.toLocaleString()}㎡ (${pyeong}평)` },
    { label: '평당가격', value: formatPrice(ppPyeong) },
    { label: '주소', value: property.address },
  ];

  const landRows = [
    { label: '지목', value: property.landCategory },
    { label: '용도지역', value: property.zoning },
    { label: '도로접면', value: property.roadFrontage || '-' },
    { label: '형상', value: property.shape || '-' },
    { label: '지세', value: property.terrain || '-' },
    { label: '위반건축물', value: property.illegalBuilding ? '해당' : '해당없음' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/properties" className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 매물 목록
          </Link>

          {/* Photo gallery placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-lg overflow-hidden">
            <div className="h-64 md:h-80 gradient-navy flex items-center justify-center">
              <span className="text-primary-foreground/50">대표 사진</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[calc(10rem-4px)] md:h-[calc(10rem-4px)] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground/50 text-xs">사진 {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Title and badges */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground">{property.type}</Badge>
              <Badge variant={property.dealType === '매매' ? 'default' : 'secondary'}>{property.dealType}</Badge>
              {property.illegalBuilding && (
                <Badge className="bg-destructive text-destructive-foreground border-transparent">위반건축물</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{property.title}</h1>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
              <MapPin className="w-4 h-4" /> {property.address}
            </div>
          </div>

          {/* Price highlight */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="text-3xl font-bold text-accent">{formatPrice(property.price)}</div>
            {property.dealType === '임대' && property.monthlyRent && (
              <div className="text-muted-foreground mt-1">보증금 {formatPrice(property.price)} / 월세 {formatPrice(property.monthlyRent)}</div>
            )}
            <div className="text-muted-foreground text-sm mt-2">
              평당 {formatPrice(ppPyeong)} · {property.areaSqm.toLocaleString()}㎡ ({pyeong}평)
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
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

          {/* Land info */}
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
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

          {/* Description */}
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
            <h3 className="px-6 py-3 bg-muted font-semibold text-foreground">매물 설명</h3>
            <div className="px-6 py-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
              {property.description}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href="https://t.me/your_telegram"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-gold"
            >
              💬 텔레그램으로 문의하기
            </a>
            <a
              href="tel:031-123-4567"
              className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-border text-foreground py-3 rounded-lg font-semibold hover:border-accent hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4" /> 전화 문의
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
