import { Link } from 'react-router-dom';
import { Property, sqmToPyeong, pricePerPyeong, formatPrice, getYoutubeEmbedUrl, maskAddress } from '@/lib/types';
import { MapPin, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
}

const typeColors: Record<string, string> = {
  '토지': 'bg-emerald-600 text-white',
  '공장': 'bg-blue-600 text-white',
  '창고': 'bg-amber-600 text-white',
  '기타': 'bg-purple-600 text-white',
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  const pyeong = sqmToPyeong(property.areaSqm);
  const ppPyeong = pricePerPyeong(property.price, property.areaSqm);
  const embedUrl = getYoutubeEmbedUrl(property.videoUrl || '');
  const hasVideo = !!embedUrl;
  const hasImage = property.images && property.images.length > 0;
  // 고객에게 보여줄 마스킹 주소
  const displayAddress = maskAddress(property.address);

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border"
    >
      {/* 미디어: 비디오 > 이미지 > 기본 */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {hasVideo ? (
          <>
            <img
              src={`https://img.youtube.com/vi/${embedUrl!.split('/embed/')[1]}/hqdefault.jpg`}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium">동영상</div>
          </>
        ) : hasImage ? (
          <>
            <img
              src={property.images[0]}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {property.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">📷 {property.images.length}</div>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 gradient-navy opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              {property.type === '토지' ? '🌿' : property.type === '공장' ? '🏭' : '🏢'}
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${typeColors[property.type]}`}>{property.type}</span>
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${property.dealType === '매매' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>
            {property.dealType}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-card-foreground text-sm mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.title}
        </h3>
        {/* 마스킹된 주소 표시 */}
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{displayAddress}</span>
        </div>
        <div className="mb-3">
          <span className="text-accent font-bold text-lg">{formatPrice(property.price)}</span>
          {property.dealType === '임대' && property.monthlyRent && (
            <span className="text-muted-foreground text-xs ml-2">/ 월 {formatPrice(property.monthlyRent)}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
          <span>{property.areaSqm.toLocaleString()}㎡ ({pyeong}평)</span>
          <span className="text-border">|</span>
          <span>평당 {formatPrice(ppPyeong)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge variant="secondary" className="text-xs px-2 py-0.5">{property.landCategory}</Badge>
          <Badge variant="outline" className="text-xs px-2 py-0.5">{property.zoning}</Badge>
          {property.illegalBuilding && (
            <Badge className="text-xs px-2 py-0.5 bg-destructive text-destructive-foreground border-transparent">위반건축물</Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
