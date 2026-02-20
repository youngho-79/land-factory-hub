import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-accent" />
              <span className="font-bold text-lg">대한공인중개사사무소</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              토지·공장·창고 전문<br />
              20년 경력의 신뢰할 수 있는 부동산 파트너
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-accent mb-4">바로가기</h4>
            <nav className="space-y-2">
              <Link to="/properties" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">매물 목록</Link>
              <Link to="/register" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">매물 등록</Link>
              <Link to="/about" className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">사무소 소개</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold text-accent mb-4">연락처</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p>📞 031-123-4567</p>
              <p>📱 010-1234-5678</p>
              <p>📧 daehan@realestate.co.kr</p>
              <p>📍 경기도 화성시 팔탄면 시청로 123</p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/50">
          © 2026 대한공인중개사사무소. All rights reserved. | 등록번호: 41590-2020-00123
        </div>
      </div>
    </footer>
  );
};

export default Footer;
