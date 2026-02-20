import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import SearchFilters, { FilterState } from '@/components/SearchFilters';
import { sampleProperties } from '@/lib/sampleData';
import { sqmToPyeong } from '@/lib/types';

const Properties = () => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: '', dealType: 'all', propertyType: 'all', region: 'all', priceRange: 'all', areaRange: 'all',
  });

  const filtered = useMemo(() => {
    return sampleProperties.filter((p) => {
      if (filters.keyword && !p.title.includes(filters.keyword) && !p.address.includes(filters.keyword)) return false;
      if (filters.dealType !== 'all' && p.dealType !== filters.dealType) return false;
      if (filters.propertyType !== 'all' && p.type !== filters.propertyType) return false;
      if (filters.region !== 'all' && p.region !== filters.region) return false;

      if (filters.priceRange !== 'all') {
        const price = p.price;
        switch (filters.priceRange) {
          case '~1억': if (price > 10000) return false; break;
          case '1~3억': if (price <= 10000 || price > 30000) return false; break;
          case '3~5억': if (price <= 30000 || price > 50000) return false; break;
          case '5~10억': if (price <= 50000 || price > 100000) return false; break;
          case '10억~': if (price <= 100000) return false; break;
        }
      }

      if (filters.areaRange !== 'all') {
        const pyeong = sqmToPyeong(p.areaSqm);
        switch (filters.areaRange) {
          case '~500': if (pyeong > 500) return false; break;
          case '500~1000': if (pyeong <= 500 || pyeong > 1000) return false; break;
          case '1000~2000': if (pyeong <= 1000 || pyeong > 2000) return false; break;
          case '2000~': if (pyeong <= 2000) return false; break;
        }
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">매물 목록</h1>
          <SearchFilters onFilter={setFilters} />
          <p className="text-muted-foreground text-sm mt-4 mb-6">총 {filtered.length}건</p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">검색 결과가 없습니다.</p>
              <p className="text-sm mt-2">필터를 변경해보세요.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
