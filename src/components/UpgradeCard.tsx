import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, BarChart3, Shield, Sparkles } from 'lucide-react';
import { PRICING } from '@/hooks/useSubscription';

interface UpgradeCardProps {
  onUpgrade?: () => void;
  compact?: boolean;
}

const features = [
  { icon: Zap, text: 'Unlimited resources' },
  { icon: Sparkles, text: 'Unlimited AI roadmaps' },
  { icon: BarChart3, text: 'Advanced analytics' },
  { icon: Shield, text: 'Certification templates' },
];

const UpgradeCard = ({ onUpgrade, compact }: UpgradeCardProps) => {
  if (compact) {
    return (
      <button
        onClick={onUpgrade}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium hover:from-amber-500/20 hover:to-orange-500/20 transition-all"
      >
        <Crown className="h-4 w-4" />
        Upgrade
      </button>
    );
  }

  return (
    <Card className="border-0 overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-0.5" />
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Go Premium</h3>
            <p className="text-xs text-muted-foreground">From {PRICING.currency}{PRICING.monthly.toLocaleString()}/month</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <f.icon className="h-3.5 w-3.5 text-amber-500" />
              <span>{f.text}</span>
            </div>
          ))}
        </div>
        <Button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 text-white font-semibold"
        >
          <Crown className="h-4 w-4 mr-2" /> Upgrade to Premium
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradeCard;
