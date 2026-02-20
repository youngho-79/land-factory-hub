import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ZONING_LIST, LAND_CATEGORY_LIST, sqmToPyeong, formatPrice } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const PropertyRegister = () => {
  const [form, setForm] = useState({
    title: '',
    type: '',
    dealType: '',
    price: '',
    monthlyRent: '',
    areaSqm: '',
    address: '',
    region: '',
    landCategory: '',
    zoning: '',
    roadFrontage: '',
    shape: '',
    terrain: '',
    description: '',
  });

  const areaSqm = parseFloat(form.areaSqm) || 0;
  const pyeong = sqmToPyeong(areaSqm);
  const price = parseFloat(form.price) || 0;
  const ppPyeong = pyeong > 0 ? Math.round(price / pyeong) : 0;

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: '매물이 등록되었습니다', description: '관리자가 확인 후 게시됩니다.' });
  };

  const generateAIDescription = () => {
    const desc = `${form.region} ${form.address}에 위치한 ${form.zoning} ${form.type}입니다. 면적 ${areaSqm.toLocaleString()}㎡(${pyeong}평), ${form.landCategory} 지목. ${form.roadFrontage ? form.roadFrontage + '. ' : ''}${form.dealType === '매매' ? `매매가 ${formatPrice(price)}` : `보증금 ${formatPrice(price)}, 월세 ${formatPrice(parseFloat(form.monthlyRent) || 0)}`}, 평당 ${formatPrice(ppPyeong)}. ${form.shape ? form.shape + ' 형상, ' : ''}${form.terrain ? form.terrain + ' 지형.' : ''}`;
    update('description', desc);
    toast({ title: 'AI 매물설명이 생성되었습니다' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">매물 등록</h1>
          <p className="text-muted-foreground mb-8">관리자 전용 매물 등록 페이지입니다.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본정보 */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">기본정보</h3>

              <div>
                <Label>매물명</Label>
                <Input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="예: 화성시 팔탄면 토지 1,200평" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>매물유형</Label>
                  <Select value={form.type} onValueChange={(v) => update('type', v)}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="토지">토지</SelectItem>
                      <SelectItem value="공장">공장</SelectItem>
                      <SelectItem value="창고">창고</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>거래유형</Label>
                  <Select value={form.dealType} onValueChange={(v) => update('dealType', v)}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="매매">매매</SelectItem>
                      <SelectItem value="임대">임대</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>주소</Label>
                <Input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="주소를 입력하세요" />
              </div>
            </div>

            {/* 가격·면적 */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">가격·면적</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>총매매대금 (만원)</Label>
                  <Input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="예: 180000" />
                </div>
                {form.dealType === '임대' && (
                  <div>
                    <Label>월세 (만원)</Label>
                    <Input type="number" value={form.monthlyRent} onChange={(e) => update('monthlyRent', e.target.value)} placeholder="예: 350" />
                  </div>
                )}
              </div>

              <div>
                <Label>면적 (㎡)</Label>
                <Input type="number" value={form.areaSqm} onChange={(e) => update('areaSqm', e.target.value)} placeholder="예: 3967" />
                {areaSqm > 0 && (
                  <div className="text-sm text-accent mt-1 font-medium">
                    = {pyeong}평 {ppPyeong > 0 && `| 평당 ${formatPrice(ppPyeong)}`}
                  </div>
                )}
              </div>
            </div>

            {/* 토지정보 */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">토지정보</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>지목</Label>
                  <Select value={form.landCategory} onValueChange={(v) => update('landCategory', v)}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      {LAND_CATEGORY_LIST.map((lc) => <SelectItem key={lc} value={lc}>{lc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>용도지역</Label>
                  <Select value={form.zoning} onValueChange={(v) => update('zoning', v)}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      {ZONING_LIST.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>도로접면</Label>
                <Input value={form.roadFrontage} onChange={(e) => update('roadFrontage', e.target.value)} placeholder="예: 6m 포장도로 접면" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>형상</Label>
                  <Input value={form.shape} onChange={(e) => update('shape', e.target.value)} placeholder="예: 정방형" />
                </div>
                <div>
                  <Label>지세</Label>
                  <Input value={form.terrain} onChange={(e) => update('terrain', e.target.value)} placeholder="예: 평지" />
                </div>
              </div>
            </div>

            {/* 매물설명 */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">매물 설명</h3>
                <Button type="button" variant="outline" size="sm" onClick={generateAIDescription} className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
                  ✨ AI 자동생성
                </Button>
              </div>
              <Textarea
                rows={5}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="매물 설명을 입력하거나 AI 자동생성 버튼을 클릭하세요..."
              />
            </div>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-gold-dark py-3 font-semibold">
              매물 등록하기
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyRegister;
