export type PropertyType = '토지' | '공장' | '창고' | '기타';
export type DealType = '매매' | '임대';
export type PropertyStatus = 'active' | 'hidden' | 'sold';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  dealType: DealType;
  status: PropertyStatus; // active(노출) | hidden(숨김) | sold(거래완료)
  price: number;
  monthlyRent?: number;
  areaSqm: number;
  buildingAreaSqm?: number;
  totalFloorAreaSqm?: number;
  groundFloor?: number;
  undergroundFloor?: number;
  structureName?: string;
  useApprovalDate?: string;
  address: string;          // 실제 전체 주소 (관리자만)
  addressMasked?: string;   // 마스킹 주소 (고객용, 자동생성)
  region: string;
  landCategory: string;
  zoning: string;
  roadFrontage?: string;
  shape?: string;
  terrain?: string;
  illegalBuilding?: boolean;
  description: string;
  blogPost?: string;
  images: string[];
  videoUrl?: string;
  memo?: string;            // 관리자 메모 (비공개)
  ownerPhone?: string;      // 소유자 전화번호 (비공개)
  createdAt: string;
  updatedAt?: string;
  // 공인중개사법 의무사항
  agencyName?: string;
  agentName?: string;
  registrationNo?: string;
  agencyAddress?: string;
  agencyPhone?: string;
}

export interface Consultation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerPhone: string;
  message?: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

// 지번 마스킹: "화성시 팔탄면 구장리 123-4" → "화성시 팔탄면 구장리 ***-*"
export const maskAddress = (address: string): string => {
  if (!address) return '';
  // 번지수 패턴 마스킹 (숫자-숫자 또는 숫자만)
  return address.replace(/(\d+)([-–]\d+)?$/, (match) => {
    const parts = match.split('-');
    return parts[0].replace(/\d/g, '*') + (parts[1] ? '-' + parts[1].replace(/\d/g, '*') : '');
  });
};

// 유튜브 embed URL 변환
export const getYoutubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  if (url.includes('youtube.com/embed/')) return url;
  return null;
};

export const sqmToPyeong = (sqm: number): number =>
  Math.round((sqm / 3.3058) * 10) / 10;

export const pricePerPyeong = (totalPrice: number, sqm: number): number => {
  const pyeong = sqmToPyeong(sqm);
  if (pyeong === 0) return 0;
  return Math.round(totalPrice / pyeong);
};

export const formatPrice = (price: number): string => {
  if (price >= 10000) {
    const eok = Math.floor(price / 10000);
    const remainder = price % 10000;
    if (remainder === 0) return `${eok}억`;
    return `${eok}억 ${remainder.toLocaleString()}만`;
  }
  return `${price.toLocaleString()}만`;
};

export const ZONING_LIST = [
  '제1종전용주거', '제2종전용주거', '제1종일반주거', '제2종일반주거', '제3종일반주거',
  '준주거', '중심상업', '일반상업', '근린상업', '유통상업', '전용공업', '일반공업', '준공업',
  '보전녹지', '생산녹지', '자연녹지', '보전관리', '생산관리', '계획관리', '농림', '자연환경보전',
];

export const LAND_CATEGORY_LIST = [
  '전', '답', '과수원', '목장용지', '임야', '광천지', '염전', '대', '공장용지', '학교용지',
  '주차장', '주유소용지', '창고용지', '도로', '철도용지', '제방', '하천', '구거', '유지',
  '양어장', '수도용지', '공원', '체육용지', '유원지', '종교용지', '사적지', '묘지', '잡종지',
];

export const REGIONS = [
  '서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종',
  '전북', '전남', '광주', '경북', '경남', '부산', '대구', '울산', '제주',
];

// 메뉴 카테고리 정의
export const MENU_CATEGORIES = [
  { label: '공장매매', type: '공장' as PropertyType, dealType: '매매' as DealType },
  { label: '공장임대', type: '공장' as PropertyType, dealType: '임대' as DealType },
  { label: '창고매매', type: '창고' as PropertyType, dealType: '매매' as DealType },
  { label: '창고임대', type: '창고' as PropertyType, dealType: '임대' as DealType },
  { label: '토지', type: '토지' as PropertyType, dealType: null },
];
