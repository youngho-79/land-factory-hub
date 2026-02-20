import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ChevronDown, Home, Phone } from 'lucide-react';

const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/your_id';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [propertyMenuOpen, setPropertyMenuOpen] = useState(false);
  const location = useLocation();

  const mainNav = [
    { label: '홈', path: '/' },
    { label: '사무소 소개', path: '/about' },
    { label: '부동산 소식', path: '/blog' },
  ];

  const propertyMenuItems = [
    { label: '공장 매매', path: '/properties?type=공장&deal=매매' },
    { label: '공장 임대', path: '/properties?type=공장&deal=임대' },
    { label: '창고 매매', path: '/properties?type=창고&deal=매매' },
    { label: '창고 임대', path: '/properties?type=창고&deal=임대' },
    { label: '토지', path: '/properties?type=토지' },
    { label: '기타', path: '/properties?type=기타' },
  ];

  const isPropertiesActive = location.pathname === '/properties';

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-primary" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-accent font-extrabold text-lg tracking-tight">PX마을 부동산</div>
              <div className="text-primary-foreground/60 font-normal text-xs tracking-wide">토지 · 공장 · 창고 전문</div>
            </div>
          </Link>

          {/* 데스크탑 nav */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNav.map((item) => (
              <Link key={item.path} to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                  ? 'bg-accent text-accent-foreground'
                  : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* 매물 드롭다운 */}
            <div className="relative" onMouseEnter={() => setPropertyMenuOpen(true)} onMouseLeave={() => setPropertyMenuOpen(false)}>
              <button className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isPropertiesActive ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                }`}>
                매물 <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {propertyMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 w-36 z-50">
                  {propertyMenuItems.map((item) => (
                    <Link key={item.path} to={item.path}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setPropertyMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 전화상담 추가 (태블릿/데스크탑) */}
            <a href="tel:010-2006-8279" className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md font-bold text-accent hover:text-accent/80 transition-colors ml-2">
              <Phone className="w-4 h-4" /> 전화상담 010-2006-8279
            </a>
          </nav>

          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">
            💬 텔레그램 상담
          </a>

          <button className="md:hidden text-primary-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 모바일 nav */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {mainNav.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-1 text-xs text-primary-foreground/50 font-medium uppercase tracking-wide">매물</div>
            {propertyMenuItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-2 rounded-md text-sm text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-1 mt-2 mb-1 border-t border-white/10"></div>
            <a href="tel:010-2006-8279" className="flex items-center justify-center gap-2 px-4 py-3 text-accent font-bold text-sm bg-accent/10 rounded-md mx-2 mb-2">
              <Phone className="w-4 h-4" /> 전화상담 010-2006-8279
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="block px-4 py-3 bg-accent text-accent-foreground rounded-md text-sm font-semibold text-center mx-2 mt-2">
              💬 텔레그램 상담
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
