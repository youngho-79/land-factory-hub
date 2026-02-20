import { Link } from 'react-router-dom';
import { Property, sqmToPyeong, pricePerPyeong, formatPrice } from '@/lib/types';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
}

const typeColors: Record<string, string> = {
  '토지': 'bg-emerald-600 text-white',
  '공장': 'bg-blue-600 text-white',
  '창고': 'bg-amber-600 text-white',
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  const pyeong = sqmToPyeong(property.areaSqm);
  const ppPyeong = pricePerPyeong(property.price, property.areaSqm);

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border"
    >
      {/* Image area */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <div className="absolute inset-0 gradient-navy opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary-foreground/50 text-sm">매물 사진</span>
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${typeColors[property.type]}`}>
            {property.type}
          </span>
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${
            property.dealType === '매매' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
          }`}>
            {property.dealType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground text-sm mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-accent font-bold text-lg">{formatPrice(property.price)}</span>
          {property.dealType === '임대' && property.monthlyRent && (
            <span className="text-muted-foreground text-xs ml-2">/ 월 {formatPrice(property.monthlyRent)}</span>
          )}
        </div>

        {/* Info row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
          <span>{property.areaSqm.toLocaleString()}㎡ ({pyeong}평)</span>
          <span className="text-border">|</span>
          <span>평당 {formatPrice(ppPyeong)}</span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mt-3">
          <Badge variant="secondary" className="text-xs px-2 py-0.5">{property.landCategory}</Badge>
          <Badge variant="outline" className="text-xs px-2 py-0.5">{property.zoning}</Badge>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
