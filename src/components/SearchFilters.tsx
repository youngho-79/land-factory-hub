import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REGIONS } from '@/lib/types';

interface SearchFiltersProps {
  onFilter: (filters: FilterState) => void;
}

export interface FilterState {
  keyword: string;
  dealType: string;
  propertyType: string;
  region: string;
  priceRange: string;
  areaRange: string;
}

const SearchFilters = ({ onFilter }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    dealType: 'all',
    propertyType: 'all',
    region: 'all',
    priceRange: 'all',
    areaRange: 'all',
  });

  const update = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-md border border-border space-y-4">
      {/* Keyword search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="주소, 매물명으로 검색..."
          className="pl-10"
          value={filters.keyword}
          onChange={(e) => update('keyword', e.target.value)}
        />
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Select value={filters.dealType} onValueChange={(v) => update('dealType', v)}>
          <SelectTrigger><SelectValue placeholder="거래유형" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="매매">매매</SelectItem>
            <SelectItem value="임대">임대</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.propertyType} onValueChange={(v) => update('propertyType', v)}>
          <SelectTrigger><SelectValue placeholder="매물유형" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="토지">토지</SelectItem>
            <SelectItem value="공장">공장</SelectItem>
            <SelectItem value="창고">창고</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.region} onValueChange={(v) => update('region', v)}>
          <SelectTrigger><SelectValue placeholder="지역" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.priceRange} onValueChange={(v) => update('priceRange', v)}>
          <SelectTrigger><SelectValue placeholder="가격대" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="~1억">1억 이하</SelectItem>
            <SelectItem value="1~3억">1~3억</SelectItem>
            <SelectItem value="3~5억">3~5억</SelectItem>
            <SelectItem value="5~10억">5~10억</SelectItem>
            <SelectItem value="10억~">10억 이상</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.areaRange} onValueChange={(v) => update('areaRange', v)}>
          <SelectTrigger><SelectValue placeholder="면적" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="~500">500평 이하</SelectItem>
            <SelectItem value="500~1000">500~1,000평</SelectItem>
            <SelectItem value="1000~2000">1,000~2,000평</SelectItem>
            <SelectItem value="2000~">2,000평 이상</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchFilters;
