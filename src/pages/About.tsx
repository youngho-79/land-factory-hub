import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Clock, Users, MapPin, Phone } from 'lucide-react';

const About = () => {
  const features = [
    { icon: Award, title: '전문성', desc: '토지·공장·창고 전문 20년 경력' },
    { icon: Clock, title: '신속한 거래', desc: '빠른 매물 매칭과 계약 진행' },
    { icon: Users, title: '맞춤 서비스', desc: '고객 맞춤형 부동산 컨설팅' },
    { icon: MapPin, title: '지역 전문가', desc: '경기남부 산업용 부동산 네트워크' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-navy py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">사무소 소개</h1>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">
              신뢰와 전문성으로 고객의 산업용 부동산 투자를 함께합니다
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <f.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About text */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">대한공인중개사사무소</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                대한공인중개사사무소는 2006년 개업 이래 토지, 공장, 창고를 전문으로 중개해온 산업용 부동산 전문 사무소입니다.
              </p>
              <p>
                경기남부 지역을 중심으로 화성, 평택, 안성, 이천, 용인, 김포 등 산업용 부동산이 집중된 지역에서 풍부한 거래 경험을 보유하고 있습니다.
              </p>
              <p>
                매수·매도, 임대·임차 고객 모두에게 최적의 매물을 매칭하여 빠르고 정확한 거래를 진행합니다. 공장 설립, 창고 임대, 토지 투자 등 다양한 목적에 맞는 맞춤형 컨설팅을 제공합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">오시는 길</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="text-muted-foreground w-20 shrink-0">사무소명</span>
                  <span className="font-medium">대한공인중개사사무소</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground w-20 shrink-0">대표</span>
                  <span>홍길동</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground w-20 shrink-0">등록번호</span>
                  <span>41590-2020-00123</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground w-20 shrink-0">주소</span>
                  <span>경기도 화성시 팔탄면 시청로 123, 2층</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground w-20 shrink-0">전화</span>
                  <span>031-123-4567 / 010-1234-5678</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground w-20 shrink-0">이메일</span>
                  <span>daehan@realestate.co.kr</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-muted-foreground w-20 shrink-0">영업시간</span>
                  <span>평일 09:00 ~ 18:00 (토요일 09:00 ~ 13:00)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
              <a
                href="https://t.me/your_telegram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                💬 텔레그램 상담
              </a>
              <a
                href="tel:031-123-4567"
                className="inline-flex items-center justify-center gap-2 border-2 border-border text-foreground px-8 py-3 rounded-lg font-semibold hover:border-accent hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" /> 전화 문의
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
