import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Phone, Building2, Warehouse, TreePine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sampleProperties } from '@/lib/sampleData';
const heroBg = '/hero-bg.jpg';


// 방문자 카운터 (localStorage 기반)
const useVisitorCount = () => {
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const storedTotal = parseInt(localStorage.getItem('px_visit_total') || '1240');
    const storedTodayDate = localStorage.getItem('px_visit_today_date') || '';
    const storedTodayCount = parseInt(localStorage.getItem('px_visit_today_count') || '0');
    const newTotal = storedTotal + 1;
    const newToday = storedTodayDate === todayKey ? storedTodayCount + 1 : 1;
    localStorage.setItem('px_visit_total', String(newTotal));
    localStorage.setItem('px_visit_today_date', todayKey);
    localStorage.setItem('px_visit_today_count', String(newToday));
    setTotal(newTotal);
    setToday(newToday);
  }, []);
  return { total, today };
};

const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/your_id';
const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER || '031-123-4567';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { total, today } = useVisitorCount();
  const activeCount = sampleProperties.filter(p => p.status === 'active').length;
  const featuredProperties = sampleProperties.filter(p => p.status === 'active').slice(0, 6);

  const categories = [
    { icon: Building2, label: '공장 매매', path: '/properties?type=공장&deal=매매', color: 'text-blue-500' },
    { icon: Building2, label: '공장 임대', path: '/properties?type=공장&deal=임대', color: 'text-blue-400' },
    { icon: Warehouse, label: '창고 매매', path: '/properties?type=창고&deal=매매', color: 'text-amber-500' },
    { icon: Warehouse, label: '창고 임대', path: '/properties?type=창고&deal=임대', color: 'text-amber-400' },
    { icon: TreePine, label: '토지',      path: '/properties?type=토지',            color: 'text-emerald-500' },
    { icon: Building2, label: '기타',     path: '/properties?type=기타',            color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 히어로 */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="산업단지" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/85 via-navy/75 to-navy-dark/90" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-accent font-semibold text-sm md:text-base tracking-widest uppercase mb-3">
            토지 · 공장 · 창고 전문
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
            PX마을 부동산
          </h1>
          <p className="text-primary-foreground/70 text-base md:text-lg mb-8 max-w-xl mx-auto">
            경기 북부 산업용 부동산, 믿을 수 있는 전문가와 함께하세요
          </p>
          <div className="max-w-2xl mx-auto flex gap-2">
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
              <Button className="h-12 px-6 bg-accent text-accent-foreground hover:bg-gold-dark font-semibold">검색</Button>
            </Link>
          </div>
          <div className="flex justify-center gap-8 md:gap-16 mt-10">
            {[
              { label: '누적 방문자', value: total.toLocaleString() },
              { label: '오늘 방문자', value: today.toLocaleString() },
              { label: '등록 매물', value: `${activeCount}건` },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
                <div className="text-primary-foreground/60 text-xs md:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 빠른 메뉴 */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-6 gap-2">
            {categories.map((cat) => (
              <Link key={cat.path} to={cat.path}
                className="flex flex-col items-center gap-1.5 p-2 md:p-4 rounded-xl hover:bg-muted transition-colors group">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-muted group-hover:bg-background flex items-center justify-center transition-colors">
                  <cat.icon className={`w-5 h-5 md:w-6 md:h-6 ${cat.color}`} />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 매물 */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">대표 매물</h2>
              <p className="text-muted-foreground mt-1">엄선된 추천 매물을 확인하세요</p>
            </div>
            <Link to="/properties" className="flex items-center gap-1 text-accent hover:underline text-sm font-medium">
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* 사무소 소개 미리보기 */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">PX마을 부동산</h2>
          <p className="text-foreground/70 leading-relaxed max-w-2xl mx-auto mb-8">
            저희는 토지·공장·창고를 전문으로 하는 공인중개사사무소입니다.<br />
            경기 북부 지역을 중심으로 오랫동안 지역 사업자분들과 함께해왔습니다.<br />
            복잡한 산업용 부동산 거래, 처음부터 끝까지 편하게 맡겨주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/about"
              className="inline-flex items-center justify-center gap-2 border-2 border-border text-foreground px-8 py-3 rounded-lg font-semibold hover:border-accent hover:text-accent transition-colors">
              사무소 소개 보기
            </Link>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              💬 텔레그램 상담
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
