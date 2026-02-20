import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Clock, Users, MapPin, Phone } from 'lucide-react';

const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/your_id';
const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER || '010-2006-8279';
const AGENCY_NAME = import.meta.env.VITE_AGENCY_NAME || 'px마을 부동산';
const AGENT_NAME = import.meta.env.VITE_AGENT_NAME || '이영호';
const REGISTRATION_NO = import.meta.env.VITE_REGISTRATION_NO || '제41480-2023-00017호';
const AGENCY_ADDRESS = import.meta.env.VITE_AGENCY_ADDRESS || '경기도 파주시 학령로105(아동동)';
const BUSINESS_NO = '768-51-00786';

const About = () => {
  const features = [
    { icon: Award, title: '산업용 부동산 전문', desc: '토지·공장·창고 거래에 집중하여 쌓아온 깊이 있는 전문성' },
    { icon: Clock, title: '신속한 진행', desc: '복잡한 서류와 절차도 빠르고 정확하게 처리해드립니다' },
    { icon: Users, title: '맞춤 컨설팅', desc: '매수·매도·임대차 목적에 맞는 1:1 밀착 상담' },
    { icon: MapPin, title: '지역 밀착', desc: '경기 북부 파주·고양 지역을 중심으로 탄탄한 현지 네트워크 보유' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* 히어로 */}
        <section className="gradient-navy py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">사무소 소개</h1>
            <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg">
              산업용 부동산 거래, 편하게 맡겨주세요
            </p>
          </div>
        </section>

        {/* 사무소 사진 영역 */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-muted rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-border">
              {/* 이미지 업로드 자리 — public/office.jpg 또는 환경변수로 교체 가능 */}
              <img src="/office.jpg" alt="PX마을 부동산 사무소" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* 소개글 */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">PX마을 부동산 입니다</h2>
            <div className="space-y-5 text-foreground/75 leading-loose text-base">
              <p>
                저희 PX마을 부동산은 경기 북부 파주를 중심으로 토지·공장·창고 거래를 전문으로 하는 공인중개사사무소입니다.
              </p>
              <p>
                공장을 구하시는 사업자분, 물류창고를 찾으시는 분, 개발·투자 목적의 토지를 보시는 분—
                목적이 무엇이든 처음 상담부터 계약 완료까지 전 과정을 함께 도와드립니다.
              </p>
              <p>
                산업용 부동산은 일반 주거용 부동산과 달리 용도지역, 건축법, 인허가 문제가 복잡하게 얽혀 있습니다.
                저희는 그 복잡한 부분을 대신 정리해드리고, 고객분께서 안심하고 결정하실 수 있도록 돕겠습니다.
              </p>
              <p>
                좋은 매물이 있을 때 먼저 연락드리고, 꼭 필요한 정보만 솔직하게 말씀드리는 것을 원칙으로 합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 특징 카드 */}
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <f.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">오시는 길</h2>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="space-y-3 text-sm">
                {[
                  { label: '사무소명', value: AGENCY_NAME },
                  { label: '대표', value: AGENT_NAME },
                  { label: '등록번호', value: REGISTRATION_NO },
                  { label: '주소', value: AGENCY_ADDRESS },
                  { label: '전화', value: PHONE_NUMBER },
                  { label: '영업시간', value: '평일 09:00 ~ 18:00 / 토요일 09:00 ~ 13:00' },
                ].map((row) => (
                  <div key={row.label} className="flex gap-4">
                    <span className="text-muted-foreground w-24 shrink-0 font-semibold">{row.label}</span>
                    <span className="font-medium text-foreground break-keep">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 지도 자리 */}
            <div className="mt-6 rounded-xl h-64 flex items-center justify-center border border-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.218559092497!2d126.77259451241771!3d37.784860111425176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c917ee7b12dd7%3A0xe5f9b400f9a2e342!2z6rK96riw64-EIO2MjOyjvOyLnCDslYTrj5nrj5kg7ZWZ66C566GcIDEwNQ!5e0!3m2!1sko!2skr!4v1708428882000!5m2!1sko!2skr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#229ED9] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z" />
                </svg>
                텔레그램 상담
              </a>
              <a href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-border text-foreground px-8 py-3 rounded-lg font-semibold hover:border-accent hover:text-accent transition-colors">
                <Phone className="w-4 h-4" /> {PHONE_NUMBER}
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
