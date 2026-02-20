import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sampleProperties } from '@/lib/sampleData';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredProperties = sampleProperties.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="산업단지 항공사진"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/85 via-navy/75 to-navy-dark/90" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-accent font-semibold text-sm md:text-base tracking-widest uppercase mb-3 animate-fade-in">
            토지 · 공장 · 창고 전문
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            PX마을 부동산
          </h1>
          <p className="text-primary-foreground/70 text-base md:text-lg mb-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            파주 산업 부동산 전문가 그룹, 현장 중심의 정확한 중개
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto flex gap-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="지역, 매물유형으로 검색하세요..."
                className="pl-12 h-12 bg-card/95 backdrop-blur-sm border-0 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to={`/properties${searchQuery ? `?q=${searchQuery}` : ''}`}>
              <Button className="h-12 px-6 bg-accent text-accent-foreground hover:bg-gold-dark font-semibold">
                검색
              </Button>
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 md:gap-16 mt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { label: '등록 매물', value: '100+' },
              { label: '거래 실적', value: '500+' },
              { label: '전문성', value: '산업용' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
                <div className="text-primary-foreground/60 text-xs md:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">대표 매물</h2>
              <p className="text-muted-foreground mt-1">엄선된 추천 매물을 확인하세요</p>
            </div>
            <Link
              to="/properties"
              className="hidden md:flex items-center gap-1 text-accent font-semibold text-sm hover:underline"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          <Link
            to="/properties"
            className="md:hidden flex items-center justify-center gap-1 text-accent font-semibold text-sm mt-6 hover:underline"
          >
            전체 매물 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* About + CTA */}
      <section className="py-16 gradient-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            전문가와 함께하세요
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8 leading-relaxed">
            파주 전 지역 공장·창고·토지 매매·임대 전문입니다.<br />
            사장님의 성공 비즈니스 파트너로서 최선을 다하겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/your_telegram"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-gold"
            >
              💬 텔레그램 상담하기
            </a>
            <a
              href="tel:031-957-8949"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground/30 text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:border-accent hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4" /> 전화 상담
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
