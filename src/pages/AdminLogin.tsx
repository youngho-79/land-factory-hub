import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ADMIN_PASSWORD = 'px2006';

const AdminLogin = () => {
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', '1');
        navigate('/admin/dashboard');
      } else {
        toast({ title: '비밀번호가 틀렸습니다', variant: 'destructive' });
        setPw('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Building2 className="w-8 h-8 text-accent" />
          <span className="text-foreground font-bold text-xl">관리자 로그인</span>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="비밀번호 입력"
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-accent text-accent-foreground" disabled={loading}>
            {loading ? '확인 중...' : '로그인'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-6">
          관리자 전용 페이지입니다
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
