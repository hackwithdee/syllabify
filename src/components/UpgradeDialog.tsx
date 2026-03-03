import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Zap, Sparkles, BarChart3, Shield, BookOpen } from 'lucide-react';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const freeFeatures = [
  '2 AI roadmap generations/month',
  'Up to 10 resources',
  'Basic time tracking',
  'Accountability partners',
  'Basic difficulty classification',
];

const premiumFeatures = [
  'Unlimited AI roadmaps',
  'Unlimited resources',
  'Advanced analytics & insights',
  'Certification path templates',
  'Priority AI recommendations',
  'Learning consistency insights',
];

const UpgradeDialog = ({ open, onOpenChange }: UpgradeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-500" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>Unlock the full power of Syllabify</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Free tier */}
          <div className="p-4 rounded-xl border bg-muted/30">
            <h3 className="font-display font-bold mb-3">Free</h3>
            <ul className="space-y-2">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium tier */}
          <div className="p-4 rounded-xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-orange-500/5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-display font-bold">Premium</h3>
              <Crown className="h-4 w-4 text-amber-500" />
            </div>
            <ul className="space-y-2">
              {premiumFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 text-white font-semibold h-12 text-base">
          <Crown className="h-5 w-5 mr-2" /> Coming Soon
        </Button>
        <p className="text-xs text-center text-muted-foreground">Premium features are currently in development</p>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
