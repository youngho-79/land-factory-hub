import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface ConsultationModalProps {
    propertyId: string;
    propertyTitle: string;
    onClose: () => void;
}

export default function ConsultationModal({ propertyId, propertyTitle, onClose }: ConsultationModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            toast({ title: '이름과 연락처를 입력해주세요.', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);

        try {
            const newConsultation = {
                id: Date.now().toString(),
                propertyId,
                propertyTitle,
                customerName: name,
                customerPhone: phone,
                message,
                status: 'pending',
                createdAt: new Date().toISOString(),
            };

            const stored = JSON.parse(localStorage.getItem('px_consultations') || '[]');
            localStorage.setItem('px_consultations', JSON.stringify([newConsultation, ...stored]));

            // 텔레그램 봇 연동
            const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
            const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

            if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
                const text = `🔔 [PX마을] 새로운 상담 문의\n\n🏢 매물: ${propertyTitle}\n👤 고객명: ${name}\n📞 연락처: ${phone}\n💬 문의내용: ${message || '없음'}\n\n🔗 링크: ${window.location.origin}/properties/${propertyId}`;
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
                }).catch(err => console.error('Telegram notification failed', err));
            }

            toast({ title: '상담 문의가 접수되었습니다. 곧 연락드리겠습니다.' });
            onClose();
        } catch (error) {
            toast({ title: '오류가 발생했습니다. 다시 시도해주세요.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                    <h3 className="font-bold text-lg text-foreground">상담 문의하기</h3>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm font-semibold text-foreground break-all">{propertyTitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">위 매물에 대해 상담 문의를 남겨주시면, 확인 후 즉시 연락드리겠습니다.</p>
                    </div>

                    <form id="consultation-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">이름 / 상호명 <span className="text-destructive">*</span></label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="홍길동"
                                required
                                className="bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">연락처 <span className="text-destructive">*</span></label>
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="010-1234-5678"
                                required
                                className="bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">문의 내용 (선택)</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="통화 가능하신 시간대나 궁금하신 점을 남겨주시면 상담에 도움이 됩니다."
                                rows={4}
                                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </form>
                </div>
                <div className="p-4 border-t border-border bg-muted/30">
                    <Button
                        type="submit"
                        form="consultation-form"
                        className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-gold-dark font-bold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '접수 중...' : '상담 문의 접수하기'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
