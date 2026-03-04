import { Crown } from 'lucide-react';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

const PremiumBadge = ({ className = '', size = 'sm' }: PremiumBadgeProps) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 font-semibold ${size === 'sm' ? 'text-[10px]' : 'text-xs'} ${className}`}>
    <Crown className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
    PRO
  </span>
);

export default PremiumBadge;
