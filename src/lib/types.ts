export type PropertyType = '토지' | '공장' | '창고';
export type DealType = '매매' | '임대';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  dealType: DealType;
  price: number; // 만원 단위
  monthlyRent?: number; // 임대일 경우 월세 (만원)
  areaSqm: number; // ㎡
  address: string;
  region: string;
  landCategory: string; // 지목
  zoning: string; // 용도지역
  roadFrontage?: string; // 도로접면
  shape?: string; // 형상
  terrain?: string; // 지세
  illegalBuilding?: boolean; // 위반건축물 여부
  description: string;
  images: string[];
  createdAt: string;
}

export const sqmToPyeong = (sqm: number): number => {
  return Math.round((sqm / 3.3058) * 10) / 10;
};

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
