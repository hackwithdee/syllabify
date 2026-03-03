import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PremiumBadgeProps {
  className?: string;
}

const PremiumBadge = ({ className }: PremiumBadgeProps) => (
  <Badge className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1 ${className || ''}`}>
    <Crown className="h-3 w-3" />
    PRO
  </Badge>
);

export default PremiumBadge;
