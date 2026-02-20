import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER || '031-123-4567';
const AGENCY_ADDRESS = import.meta.env.VITE_AGENCY_ADDRESS || '경기도 파주시 학령로105(아동동)';
const REGISTRATION_NO = import.meta.env.VITE_REGISTRATION_NO || '제41480-2023-00017호';
const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/your_id';
const BUSINESS_NO = '768-51-00786';
const AGENT_NAME = '이영호';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="text-accent font-extrabold text-sm">PX마을</div>
                <div className="text-primary-foreground/70 text-xs">부동산</div>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              토지·공장·창고 전문 공인중개사사무소<br />
              경기 북부 파주 지역 산업용 부동산 전문
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-accent mb-4">매물</h4>
            <nav className="space-y-2">
              <Link to="/properties?type=공장&deal=매매" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">공장 매매</Link>
              <Link to="/properties?type=공장&deal=임대" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">공장 임대</Link>
              <Link to="/properties?type=창고&deal=매매" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">창고 매매</Link>
              <Link to="/properties?type=창고&deal=임대" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">창고 임대</Link>
              <Link to="/properties?type=토지" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">토지</Link>
              <Link to="/properties?type=기타" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">기타</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold text-accent mb-4">연락처</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p>📞 {PHONE_NUMBER}</p>
              <p>📍 {AGENCY_ADDRESS}</p>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-accent transition-colors">
                💬 텔레그램 상담 →
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/50">
          Copyright px마을 부동산. All rights reserved. | 대표: {AGENT_NAME} | 등록번호: {REGISTRATION_NO} | 사업자등록번호: {BUSINESS_NO}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
