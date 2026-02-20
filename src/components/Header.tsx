import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Building2 } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: '홈', path: '/' },
    { label: '매물 목록', path: '/properties' },
    { label: '매물 등록', path: '/register' },
    { label: '사무소 소개', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="w-7 h-7 text-accent" />
            <div>
              <span className="text-primary-foreground font-bold text-lg tracking-tight">대한</span>
              <span className="text-accent font-bold text-lg">공인중개사</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Telegram CTA */}
          <a
            href="https://t.me/your_telegram"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            텔레그램 상담
          </a>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://t.me/your_telegram"
              target="_blank"
              rel="noopener noreferrer"
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
