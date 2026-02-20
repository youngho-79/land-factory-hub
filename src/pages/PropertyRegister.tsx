import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ZONING_LIST, LAND_CATEGORY_LIST, sqmToPyeong, formatPrice, getYoutubeEmbedUrl } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { fetchBuildingLedger } from '@/lib/buildingApi';
import { X, ImagePlus, Play } from 'lucide-react';

const PUBLIC_DATA_API_KEY = import.meta.env.VITE_PUBLIC_DATA_API_KEY || '';
const BUILDING_API_KEY = import.meta.env.VITE_BUILDING_API_KEY || '';
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const DEFAULT_AGENCY = {
  name: import.meta.env.VITE_AGENCY_NAME || '',
  agentName: import.meta.env.VITE_AGENT_NAME || '',
  registrationNo: import.meta.env.VITE_REGISTRATION_NO || '',
  address: import.meta.env.VITE_AGENCY_ADDRESS || '',
  phone: import.meta.env.VITE_PHONE_NUMBER || '',
};

const AreaInput = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => {
  const sqm = parseFloat(value) || 0;
  const pyeong = sqmToPyeong(sqm);
  return (
    <div>
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || '㎡ 입력'} />
      {sqm > 0 && <div className="text-sm text-accent mt-1 font-medium">= {pyeong}평</div>}
    </div>
  );
};

const PropertyRegister = () => {
  const [form, setForm] = useState({
    title: '', type: '', dealType: '', price: '', monthlyRent: '',
    areaSqm: '', buildingAreaSqm: '', totalFloorAreaSqm: '',
    groundFloor: '', undergroundFloor: '', structureName: '', useApprovalDate: '',
    address: '', pnu: '', sigunguCd: '', bjdongCd: '', bun: '', ji: '',
    region: '', landCategory: '', zoning: '',
    roadFrontage: '', shape: '', terrain: '',
    illegalBuilding: false,
    description: '',
    blogPost: '',
    videoUrl: '',
    agencyName: DEFAULT_AGENCY.name,
    agentName: DEFAULT_AGENCY.agentName,
    registrationNo: DEFAULT_AGENCY.registrationNo,
    agencyAddress: DEFAULT_AGENCY.address,
    agencyPhone: DEFAULT_AGENCY.phone,
  });

  const [images, setImages] = useState<string[]>([]); // base64 or URL
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loadingLand, setLoadingLand] = useState(false);
  const [loadingBuilding, setLoadingBuilding] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [blogTab, setBlogTab] = useState<'description' | 'blog'>('description');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const areaSqm = parseFloat(form.areaSqm) || 0;
  const pyeong = sqmToPyeong(areaSqm);
  const buildingPyeong = sqmToPyeong(parseFloat(form.buildingAreaSqm) || 0);
  const totalFloorPyeong = sqmToPyeong(parseFloat(form.totalFloorAreaSqm) || 0);
  const price = parseFloat(form.price) || 0;
  const ppPyeong = pyeong > 0 ? Math.round(price / pyeong) : 0;
  const isFactory = form.type === '공장' || form.type === '창고';
  const embedUrl = getYoutubeEmbedUrl(form.videoUrl);

  const update = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ✅ 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast({ title: '최대 10장까지 업로드 가능합니다', variant: 'destructive' });
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, ev.target?.result as string]);
        setImageFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ✅ 토지 공공데이터 조회
  const fetchLandData = async () => {
    if (!form.pnu) { toast({ title: 'PNU를 입력해주세요', variant: 'destructive' }); return; }
    if (!PUBLIC_DATA_API_KEY) { toast({ title: 'VITE_PUBLIC_DATA_API_KEY 환경변수 필요', variant: 'destructive' }); return; }
    setLoadingLand(true);
    try {
      const [landRes, zoningRes] = await Promise.all([
        fetch(`https://apis.data.go.kr/1611000/nsdi/LandCharacteristicsService/attr/getLandCharacteristicsAttr?serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}&pnu=${form.pnu}&format=json&numOfRows=1&pageNo=1`),
        fetch(`https://apis.data.go.kr/1611000/nsdi/UseDistrictService/attr/getUseDistrictAttr?serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}&pnu=${form.pnu}&format=json&numOfRows=1&pageNo=1`),
      ]);
      const land = (await landRes.json())?.landCharacteristics?.field?.[0];
      const zoning = (await zoningRes.json())?.useDistrict?.field?.[0];
      const updates: Record<string, string> = {};
      if (land?.lndcgrCodeNm) updates.landCategory = land.lndcgrCodeNm;
      if (land?.lndpclAr) updates.areaSqm = String(parseFloat(land.lndpclAr));
      if (zoning?.prposAreaDstrcCodeNm) updates.zoning = zoning.prposAreaDstrcCodeNm;
      if (Object.keys(updates).length > 0) {
        setForm((prev) => ({ ...prev, ...updates }));
        toast({ title: '✅ 토지정보 불러오기 완료' });
      } else toast({ title: '데이터 없음', variant: 'destructive' });
    } catch { toast({ title: '토지 조회 실패', variant: 'destructive' }); }
    finally { setLoadingLand(false); }
  };

  // ✅ 건축물대장 조회
  const fetchBuildingData = async () => {
    if (!form.sigunguCd || !form.bjdongCd || !form.bun) {
      toast({ title: '시군구코드, 법정동코드, 번지를 입력해주세요', variant: 'destructive' }); return;
    }
    if (!BUILDING_API_KEY) { toast({ title: 'VITE_BUILDING_API_KEY 환경변수 필요', variant: 'destructive' }); return; }
    setLoadingBuilding(true);
    try {
      const info = await fetchBuildingLedger(BUILDING_API_KEY, form.sigunguCd, form.bjdongCd, form.bun, form.ji);
      if (info) {
        setForm((prev) => ({
          ...prev,
          buildingAreaSqm: info.buildingArea > 0 ? String(info.buildingArea) : prev.buildingAreaSqm,
          totalFloorAreaSqm: info.totalArea > 0 ? String(info.totalArea) : prev.totalFloorAreaSqm,
          areaSqm: info.plotArea > 0 ? String(info.plotArea) : prev.areaSqm,
          groundFloor: info.groundFloorCount > 0 ? String(info.groundFloorCount) : prev.groundFloor,
          undergroundFloor: info.undergroundFloorCount > 0 ? String(info.undergroundFloorCount) : prev.undergroundFloor,
          structureName: info.structureName || prev.structureName,
          useApprovalDate: info.useApprovalDate || prev.useApprovalDate,
          illegalBuilding: info.illegalBuilding,
        }));
        toast({ title: '✅ 건축물대장 완료', description: info.illegalBuilding ? '⚠️ 위반건축물' : undefined });
      } else toast({ title: '건축물 정보 없음', variant: 'destructive' });
    } catch { toast({ title: '건축물대장 조회 실패', variant: 'destructive' }); }
    finally { setLoadingBuilding(false); }
  };

  // ✅ Claude AI 매물 설명 생성
  const generateAIDescription = async () => {
    if (!form.address || !form.type) { toast({ title: '주소와 매물유형을 먼저 입력해주세요', variant: 'destructive' }); return; }
    if (!ANTHROPIC_API_KEY) {
      const desc = `${form.address}에 위치한 ${form.zoning} ${form.type}입니다. 토지면적 ${areaSqm.toLocaleString()}㎡(${pyeong}평)${form.buildingAreaSqm ? `, 건축면적 ${form.buildingAreaSqm}㎡(${buildingPyeong}평), 연면적 ${form.totalFloorAreaSqm}㎡(${totalFloorPyeong}평)` : ''}, ${form.landCategory} 지목. ${form.dealType === '매매' ? `매매가 ${formatPrice(price)}, 평당 ${formatPrice(ppPyeong)}` : `보증금 ${formatPrice(price)}, 월세 ${formatPrice(parseFloat(form.monthlyRent)||0)}`}.`;
      update('description', desc);
      toast({ title: '기본 매물설명 생성 완료' }); return;
    }
    setLoadingAI(true);
    try {
      const prompt = `당신은 토지·공장·창고 전문 공인중개사입니다. 아래 매물 정보로 전문적이고 신뢰감 있는 매물 소개글을 300자 내외로 작성해주세요.
매물: ${form.type}(${form.dealType}) / 주소: ${form.address}
토지: ${areaSqm}㎡(${pyeong}평) / 지목: ${form.landCategory} / 용도지역: ${form.zoning}
${form.buildingAreaSqm ? `건축면적: ${form.buildingAreaSqm}㎡(${buildingPyeong}평) / 연면적: ${form.totalFloorAreaSqm}㎡(${totalFloorPyeong}평)` : ''}
${form.groundFloor ? `층수: 지상${form.groundFloor}층` : ''} ${form.structureName ? `/ 구조: ${form.structureName}` : ''}
도로: ${form.roadFrontage||'미입력'} / 형상: ${form.shape||'미입력'} / 지세: ${form.terrain||'미입력'}
가격: ${form.dealType==='매매' ? `${formatPrice(price)}, 평당${formatPrice(ppPyeong)}` : `보증금${formatPrice(price)}/월${formatPrice(parseFloat(form.monthlyRent)||0)}`}
${form.illegalBuilding ? '위반건축물 있음' : ''}
작성: 위치·접근성(IC·도로·산업단지), 활용가능성, 투자장점을 전문적으로.`;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text;
      if (text) { update('description', text); toast({ title: '✅ AI 매물설명 생성 완료' }); }
    } catch { toast({ title: 'AI 생성 실패', variant: 'destructive' }); }
    finally { setLoadingAI(false); }
  };

  // ✅ Gemini 블로그 포스팅 생성 (SEO 최적화 + 주변정보 + 이미지 생성)
  const generateBlogPost = async () => {
    if (!form.address || !form.type) { toast({ title: '주소와 매물유형을 먼저 입력해주세요', variant: 'destructive' }); return; }
    if (!GEMINI_API_KEY) { toast({ title: 'VITE_GEMINI_API_KEY 환경변수 필요', description: 'Gemini API 키를 설정해주세요', variant: 'destructive' }); return; }
    setLoadingBlog(true);
    try {
      const prompt = `당신은 부동산 전문 블로그 작가이자 SEO 전문가입니다.
아래 매물 정보를 바탕으로 네이버 블로그 상위노출을 위한 SEO 최적화 포스팅을 작성해주세요.

매물정보:
- 유형: ${form.type} (${form.dealType})
- 주소: ${form.address}
- 토지면적: ${areaSqm}㎡(${pyeong}평) / 지목: ${form.landCategory} / 용도지역: ${form.zoning}
${form.buildingAreaSqm ? `- 건축면적: ${form.buildingAreaSqm}㎡(${buildingPyeong}평) / 연면적: ${form.totalFloorAreaSqm}㎡(${totalFloorPyeong}평)` : ''}
${form.groundFloor ? `- 층수: 지상${form.groundFloor}층 / 구조: ${form.structureName}` : ''}
- 도로접면: ${form.roadFrontage||'미입력'}
- 가격: ${form.dealType==='매매' ? `매매가 ${formatPrice(price)}, 평당 ${formatPrice(ppPyeong)}` : `보증금 ${formatPrice(price)}, 월세 ${formatPrice(parseFloat(form.monthlyRent)||0)}`}
${form.illegalBuilding ? '- ⚠️ 위반건축물 있음' : ''}

작성 요구사항:
1. 제목: 검색 키워드가 포함된 클릭율 높은 제목 (지역명+매물유형+평수+거래유형 포함)
2. 도입부: 자연스럽고 따뜻한 도입 (2~3문장)
3. 위치 및 교통: 주소 지번 기반으로 인근 IC, 국도, 고속도로, 대중교통, 산업단지 등 사실적으로 추정해서 작성 (구체적 숫자 포함, 예: "서해안고속도로 발안IC에서 차량으로 약 8분 거리")
4. 토지/건물 특징: 면적, 지목, 용도지역, 도로접면, 형상, 층수, 구조 등 상세히
5. 투자/사업 포인트: 활용가능성, 장점, 주변 개발호재 등
6. 가격 분석: 평당가 기준 시세 대비 경쟁력
7. 마무리: 신뢰감 있고 부드러운 마무리 + 문의 유도
8. 해시태그: 네이버 검색 최적화 해시태그 15개

전체 길이: 1500~2000자
문체: 자연스럽고 부드러우면서 전문적, 신뢰감 있게
주의: 과장 없이 사실 기반으로 작성`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 3000 },
        }),
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        update('blogPost', text);
        setBlogTab('blog');
        toast({ title: '✅ Gemini 블로그 포스팅 생성 완료', description: '네이버 SEO 최적화 글이 작성되었습니다' });
      } else throw new Error('응답 없음');
    } catch (e) {
      console.error(e);
      toast({ title: '블로그 생성 실패', description: 'Gemini API 키를 확인해주세요', variant: 'destructive' });
    } finally { setLoadingBlog(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agencyName || !form.agentName || !form.registrationNo || !form.agencyAddress || !form.agencyPhone) {
      toast({ title: '⚠️ 공인중개사법 필수사항 미입력', description: '사무소 정보를 모두 입력해주세요.', variant: 'destructive' }); return;
    }
    toast({ title: '✅ 매물이 등록되었습니다', description: '관리자 확인 후 게시됩니다.' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-2"><a href="/admin/dashboard" className="text-muted-foreground hover:text-accent text-sm">← 대시보드</a><h1 className="text-2xl md:text-3xl font-bold text-foreground">매물 등록</h1></div>
          <p className="text-muted-foreground mb-8">관리자 전용 매물 등록 페이지입니다.</p>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 공인중개사법 의무사항 */}
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-700 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-bold text-foreground">⚖️ 공인중개사법 표시광고 의무사항</h3>
                <p className="text-xs text-muted-foreground mt-1">공인중개사법 제18조의2 — 매물 광고 시 필수 표시</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>중개사무소 명칭 <span className="text-destructive">*</span></Label>
                  <Input value={form.agencyName} onChange={(e) => update('agencyName', e.target.value)} placeholder="예: 랜드허브 공인중개사사무소" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>대표 공인중개사 <span className="text-destructive">*</span></Label>
                    <Input value={form.agentName} onChange={(e) => update('agentName', e.target.value)} placeholder="예: 홍길동" />
                  </div>
                  <div>
                    <Label>등록번호 <span className="text-destructive">*</span></Label>
                    <Input value={form.registrationNo} onChange={(e) => update('registrationNo', e.target.value)} placeholder="예: 경기파주-2024-0001" />
                  </div>
                </div>
                <div>
                  <Label>소재지 <span className="text-destructive">*</span></Label>
                  <Input value={form.agencyAddress} onChange={(e) => update('agencyAddress', e.target.value)} placeholder="예: 경기도 파주시 금촌동 123-4" />
                </div>
                <div>
                  <Label>연락처 <span className="text-destructive">*</span></Label>
                  <Input value={form.agencyPhone} onChange={(e) => update('agencyPhone', e.target.value)} placeholder="예: 031-123-4567" />
                </div>
              </div>
            </div>

            {/* 기본정보 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
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
                      <SelectItem value="기타">기타</SelectItem>
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
                <Input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="예: 경기도 화성시 팔탄면 구장리 123-4" />
              </div>

              {/* 토지 자동불러오기 */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">🗺️ 토지정보 자동불러오기</p>
                    <p className="text-xs text-muted-foreground mt-0.5">PNU 19자리 → 지목·용도지역·면적 자동입력 | <a href="https://www.eum.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">토지이음</a></p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={fetchLandData} disabled={loadingLand} className="text-xs shrink-0">
                    {loadingLand ? '조회중...' : '토지 조회'}
                  </Button>
                </div>
                <div>
                  <Label className="text-xs">PNU (19자리)</Label>
                  <Input value={form.pnu} onChange={(e) => update('pnu', e.target.value)} placeholder="예: 4159010100100230000" className="font-mono text-sm" maxLength={19} />
                </div>
              </div>

              {/* 건축물대장 (공장/창고) */}
              {isFactory && (
                <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">🏭 건축물대장 자동불러오기</p>
                      <p className="text-xs text-muted-foreground mt-0.5">면적·층수·위반건축물 자동입력 | <a href="https://www.eais.go.kr" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">세움터</a></p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={fetchBuildingData} disabled={loadingBuilding} className="text-xs shrink-0">
                      {loadingBuilding ? '조회중...' : '건물 조회'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><Label className="text-xs">시군구코드</Label><Input value={form.sigunguCd} onChange={(e) => update('sigunguCd', e.target.value)} placeholder="41590" className="font-mono text-sm" maxLength={5} /></div>
                    <div><Label className="text-xs">법정동코드</Label><Input value={form.bjdongCd} onChange={(e) => update('bjdongCd', e.target.value)} placeholder="25600" className="font-mono text-sm" maxLength={5} /></div>
                    <div><Label className="text-xs">번</Label><Input value={form.bun} onChange={(e) => update('bun', e.target.value)} placeholder="123" className="font-mono text-sm" maxLength={4} /></div>
                  </div>
                  <div className="w-1/3"><Label className="text-xs">지</Label><Input value={form.ji} onChange={(e) => update('ji', e.target.value)} placeholder="0" className="font-mono text-sm" maxLength={4} /></div>
                </div>
              )}
            </div>

            {/* 가격·면적 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
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
                <Label>토지면적 (㎡)</Label>
                <Input type="number" value={form.areaSqm} onChange={(e) => update('areaSqm', e.target.value)} placeholder="예: 3967" />
                {areaSqm > 0 && <div className="text-sm text-accent mt-1 font-medium">= {pyeong}평 {ppPyeong > 0 && `| 평당 ${formatPrice(ppPyeong)}`}</div>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AreaInput label="건축면적 (㎡)" value={form.buildingAreaSqm} onChange={(v) => update('buildingAreaSqm', v)} placeholder="예: 1650" />
                <AreaInput label="연면적 (㎡)" value={form.totalFloorAreaSqm} onChange={(v) => update('totalFloorAreaSqm', v)} placeholder="예: 3300" />
              </div>
              {isFactory && (
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>지상층수</Label><Input type="number" value={form.groundFloor} onChange={(e) => update('groundFloor', e.target.value)} placeholder="예: 2" /></div>
                  <div><Label>지하층수</Label><Input type="number" value={form.undergroundFloor} onChange={(e) => update('undergroundFloor', e.target.value)} placeholder="예: 0" /></div>
                  <div><Label>구조</Label><Input value={form.structureName} onChange={(e) => update('structureName', e.target.value)} placeholder="예: 철골조" /></div>
                  <div><Label>사용승인일</Label><Input value={form.useApprovalDate} onChange={(e) => update('useApprovalDate', e.target.value)} placeholder="예: 20180315" /></div>
                </div>
              )}
            </div>

            {/* 토지정보 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">토지정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>지목</Label>
                  <Select value={form.landCategory} onValueChange={(v) => update('landCategory', v)}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>{LAND_CATEGORY_LIST.map((lc) => <SelectItem key={lc} value={lc}>{lc}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>용도지역</Label>
                  <Select value={form.zoning} onValueChange={(v) => update('zoning', v)}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>{ZONING_LIST.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>도로접면</Label><Input value={form.roadFrontage} onChange={(e) => update('roadFrontage', e.target.value)} placeholder="예: 6m 포장도로 접면" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>형상</Label><Input value={form.shape} onChange={(e) => update('shape', e.target.value)} placeholder="예: 정방형" /></div>
                <div><Label>지세</Label><Input value={form.terrain} onChange={(e) => update('terrain', e.target.value)} placeholder="예: 평지" /></div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="illegalBuilding" checked={form.illegalBuilding} onCheckedChange={(c) => update('illegalBuilding', !!c)} />
                <Label htmlFor="illegalBuilding" className="text-sm font-normal cursor-pointer">위반건축물 여부 <span className="text-xs text-muted-foreground">(2025년 의무사항)</span></Label>
              </div>
            </div>

            {/* ✅ 이미지 업로드 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">사진 업로드</h3>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">클릭하여 사진 추가 (최대 10장)</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP 지원</p>
              </div>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                      <img src={img} alt={`업로드 ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && <div className="absolute top-1 left-1 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded">대표</div>}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ 비디오 URL */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">비디오 링크</h3>
              <div>
                <Label>유튜브 URL <span className="text-xs text-muted-foreground font-normal">(있으면 목록 카드에 비디오 우선 표시)</span></Label>
                <Input value={form.videoUrl} onChange={(e) => update('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              {embedUrl && (
                <div className="rounded-lg overflow-hidden bg-muted aspect-video relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      <Play className="w-4 h-4" fill="white" /> 미리보기 — 매물목록 카드에 비디오가 표시됩니다
                    </div>
                  </div>
                  <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="비디오 미리보기" />
                </div>
              )}
            </div>

            {/* ✅ 매물설명 + 블로그포스팅 탭 */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              {/* 탭 */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setBlogTab('description')}
                  className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${blogTab === 'description' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  📝 매물 설명
                </button>
                <button
                  type="button"
                  onClick={() => setBlogTab('blog')}
                  className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${blogTab === 'blog' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  🌐 블로그 포스팅 {form.blogPost && '✅'}
                </button>
              </div>

              {blogTab === 'description' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">매물 설명 (상세페이지 표시용)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={generateAIDescription} disabled={loadingAI} className="text-accent border-accent hover:bg-accent hover:text-accent-foreground text-xs">
                      {loadingAI ? '⏳ 생성중...' : '✨ Claude AI 생성'}
                    </Button>
                  </div>
                  <Textarea rows={6} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="매물 설명을 입력하거나 AI 자동생성 버튼을 클릭하세요..." />
                </>
              )}

              {blogTab === 'blog' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">블로그 포스팅 (네이버 SEO 최적화)</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Gemini AI가 지번 기반 주변정보(IC·도로·산업단지)를 포함해 작성</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateBlogPost}
                      disabled={loadingBlog}
                      className="text-xs shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:opacity-90"
                    >
                      {loadingBlog ? '⏳ 작성중...' : '🤖 Gemini로 생성'}
                    </Button>
                  </div>
                  <Textarea
                    rows={16}
                    value={form.blogPost}
                    onChange={(e) => update('blogPost', e.target.value)}
                    placeholder="'Gemini로 생성' 버튼을 클릭하면 네이버 상위노출 최적화 블로그 포스팅이 자동 작성됩니다.&#10;&#10;생성된 내용은 자유롭게 수정 가능합니다."
                    className="font-mono text-xs leading-relaxed"
                  />
                  {form.blogPost && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => { navigator.clipboard.writeText(form.blogPost); toast({ title: '✅ 클립보드에 복사되었습니다', description: '네이버 블로그에 붙여넣기 하세요' }); }}
                      >
                        📋 전체 복사
                      </Button>
                      <span className="text-xs text-muted-foreground self-center">{form.blogPost.length.toLocaleString()}자</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-gold-dark py-3 font-semibold text-base">
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
