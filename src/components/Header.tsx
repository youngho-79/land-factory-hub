import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Building2, ChevronDown } from 'lucide-react';

const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/your_id';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [propertyMenuOpen, setPropertyMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mainNav = [
    { label: '홈', path: '/' },
    { label: '사무소 소개', path: '/about' },
  ];

  const propertyMenuItems = [
    { label: '공장 매매', path: '/properties?type=공장&deal=매매' },
    { label: '공장 임대', path: '/properties?type=공장&deal=임대' },
    { label: '창고 매매', path: '/properties?type=창고&deal=매매' },
    { label: '창고 임대', path: '/properties?type=창고&deal=임대' },
    { label: '토지',     path: '/properties?type=토지' },
  ];

  const isActive = (path: string) => location.pathname === path.split('?')[0] && (!path.includes('?') || location.search.includes(path.split('?')[1]));
  const isPropertiesActive = location.pathname === '/properties';

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Building2 className="w-7 h-7 text-accent" />
            <div>
              <span className="text-primary-foreground font-bold text-lg tracking-tight">대한</span>
              <span className="text-accent font-bold text-lg">공인중개사</span>
            </div>
          </Link>

          {/* 데스크탑 nav */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-accent text-accent-foreground'
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* 매물 드롭다운 */}
            <div className="relative" onMouseEnter={() => setPropertyMenuOpen(true)} onMouseLeave={() => setPropertyMenuOpen(false)}>
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isPropertiesActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                }`}
              >
                매물 <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {propertyMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 w-36 z-50">
                  {propertyMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setPropertyMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            텔레그램 상담
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
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
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
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="block px-4 py-2.5 bg-accent text-accent-foreground rounded-md text-sm font-semibold text-center mt-2"
            >
              텔레그램 상담
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
